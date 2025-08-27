//IMPORTS
//Node imports
import { createServer } from 'node:http';
import constants from 'node:constants';
import * as fs from 'node:fs';

//Misc imports
import tls from 'tls';
import crypto from 'node:crypto';
import { dirname, join } from "path";
import { createRequire } from "module";

//Fastify imports
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifyRateLimit from "@fastify/rate-limit";

//Proxy imports
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

//Server resources
import { publicPath, CLEANUP_INTERVAL, logToFile } from './run-settings.js';
import register_paths from "./register-paths.js";
import errorHandler from "./error-handler.js";
import startEncryption from "./encryption.js";
import { cleanupOldSessions } from "./sessioncleaner.js";

export const userSessions = new Map(); // { username: sessionId }

const require = createRequire(import.meta.url);

const scramjetDistPath = join(
  dirname(require.resolve("@mercuryworkshop/scramjet/package.json")),
  "dist"
);

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
  allow_udp_streams: false,
  hostname_blacklist: [/example\.com/],
  dns_servers: ["1.1.1.3", "1.0.0.3"]
});

const cookieKey = await crypto.randomBytes(64);

const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/testhostdomain.ddns.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/testhostdomain.ddns.net/fullchain.pem'),
  minVersion: 'TLSv1.2', // Don't allow TLSv1.1 or older
  ciphers: tls.DEFAULT_CIPHERS,
  honorCipherOrder: true,
  secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3, // Disable SSLv2/v3
}

const startTime = process.hrtime.bigint()
logToFile('important', `beginning server startup`);
console.log(`beginning server startup`);

function getUptimeMs() {
  return Number(process.hrtime.bigint() - startTime) / 1_000_000;
}

const fastify = Fastify({
  serverFactory: (handler) => {
    return createServer(httpsOptions)
      .on("request", (req, res) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        handler(req, res);
      })
      .on("upgrade", (req, socket, head) => {
        if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
        else socket.end();
      });
  },
});
logToFile('info', `fastify options processed at ${getUptimeMs()}Ms`);

fastify.register(fastifyStatic, {
  root: publicPath,
  decorateReply: true,
});
logToFile('info', `fastify started at ${getUptimeMs()}Ms`);

await fastify.register(fastifyFormbody);
await fastify.register(fastifyCookie, {
  secret: cookieKey
});
logToFile('info', `fastify cookies registered at ${getUptimeMs()}Ms`);

await fastify.register(fastifyRateLimit, {
  max: 1000,
  timeWindow: '1 minute'
});
logToFile('info', `rate limiter started ${getUptimeMs()}Ms`);

fastify.addHook('preHandler', async (request, reply) => {
  const rawUser = request.cookies.User;
  const rawSession = request.cookies.Session;

  if (!rawUser || !rawSession) {
    logToFile('info', `missing cookies from user cookie ${rawUser} and session cookie ${rawSession} at ${request.ip}`);
    console.log('Cookies: Missing cookies');
    return;
  }

  const { value: username, valid: userValid } = request.unsignCookie(rawUser);
  const { value: sessionId, valid: sessionValid } = request.unsignCookie(rawSession);

  if (!userValid || !sessionValid) {
    logToFile('info', `invalid cookies from user ${userValid} and session ID ${sessionId} at ${request.ip}`);
    console.log('Cookies: Invalid signed cookie(s)', { username, sessionId });
    reply.clearCookie('Session');
    reply.clearCookie('User');
    return reply.redirect('/login');
  }

  const validSession = userSessions.get(username);
  logToFile('info', `Cookies: user=${username}, session=${sessionId}, expected=${validSession}`);

  if (validSession !== sessionId) {
    logToFile('info', `Invalid session for user ${username} at ${request.ip} with session ID ${sessionId} and expected ${validSession}. Forcing logout.`);
    console.log(`Invalid session for user ${username}. Forcing logout.`);
    reply.clearCookie('Session');
    reply.clearCookie('User');
    return reply.redirect('/login');
  }
});
logToFile('info', `prehandler registered at ${getUptimeMs()}Ms`);

//register error handler
fastify.setErrorHandler((error, request, reply) => { errorHandler(error, request, reply) });
logToFile('info', `error handler registered at ${getUptimeMs()}Ms`);

//register paths
try {
  fastify.register(async (instance) => {
    await register_paths(instance, userSessions);
  }, { prefix: '/' });
  fastify.register(async () => {
    await startEncryption(fastify);
  }, { prefix: '/' });
  logToFile('info', `url paths registered at ${getUptimeMs()}Ms`);
} catch (error) {
  logToFile('error', `failed to register url paths at ${getUptimeMs()}Ms`);
  process.exit(1);
}

//set up proxy paths
try {
  fastify.get("/uv/uv.config.js", (req, res) => {
    return res.sendFile("uv/uv.config.js", publicPath);
  });

  fastify.register(fastifyStatic, {
    root: scramjetDistPath,
    prefix: "/scram/",
    decorateReply: false,
  });

  fastify.register(fastifyStatic, {
    root: epoxyPath,
    prefix: "/epoxy/",
    decorateReply: false,
  });

  fastify.register(fastifyStatic, {
    root: baremuxPath,
    prefix: "/baremux/",
    decorateReply: false,
  });
} catch (e) {
  logToFile('error', `failed to register proxy paths at ${getUptimeMs()}Ms`);
  process.exit(1);
}
logToFile('info', `proxy paths registered at ${getUptimeMs()}Ms`);

//start session cleaner
setInterval(cleanupOldSessions, CLEANUP_INTERVAL);
logToFile('info', `session cleaner started at ${getUptimeMs()}Ms`);

//start server
fastify.server.on("listening", () => {
  logToFile('info', `fastify listening at ${getUptimeMs()}Ms`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP/HTTPS server");
  logToFile('important', `SIGTERM signal received: closing HTTP/HTTPS server`);
  fastify.close();
  process.exit(0);
}

//the site MUST have https to work on the browser since it uses the 'crypto' function
//Ultraviolet also MUST run on 8080, i highly reccomend using a reverse proxy to route from 8080 to 443
const PORT = process.env.PORT || 8080;

fastify.listen({
  port: PORT,
  host: "0.0.0.0"
});

logToFile('important', `Server startup completed in ${getUptimeMs()}Ms, server listening on port ${PORT}`);
console.log(`Server startup completed in ${getUptimeMs()}Ms, server listening on port ${PORT}`);