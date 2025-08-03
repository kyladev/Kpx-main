//Node imports
import { createServer } from "node:http";
import { join } from "node:path";
import constants from 'node:constants';
import * as fs from 'node:fs';
import { hostname } from "node:os";

//Misc imports
// import { fileURLToPath } from 'url';
import tls from 'tls';

//Fastify imports
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';

//UV imports
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import wisp from "wisp-server-node";
// import ultraviolet from "@titaniumnetwork-dev/ultraviolet";

//Server resources
import { authMiddleware, authMiddlewareAdmin, publicPath, require_pass } from './run-settings.js';
import register_paths from "./register-paths.js";
import errorHandler from "./error-handler.js";
import settings_router from "./settings-router.js";
import resources_router from "./resources-router.js";

export const userSessions = new Map(); // { username: sessionId }

//replace paths with whatever the paths are to the ssl certificates
const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/testinghostdomain.zapto.org/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/testinghostdomain.zapto.org/fullchain.pem'),
  minVersion: 'TLSv1.2', // Don't allow TLSv1.1 or older
  ciphers: tls.DEFAULT_CIPHERS,
  honorCipherOrder: true,
  secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3, // Disable SSLv2/v3
};

const fastify = Fastify({
  // https: httpsOptions,
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

// const uv = createUvServer();

fastify.register(fastifyStatic, {
  root: publicPath,
  decorateReply: true,
});

await fastify.register(fastifyFormbody);
await fastify.register(fastifyCookie, {
  secret: `alziWLAgC5Sy5EtSh9JaaJa46KVKCK7UesL8n9hBQUZazwJoq5g5iVygjb1QC80yQvxQkntmFh0j3i5U8p8ZEZG57UUvI0DiXbMoGL7li36eaVbvFLHMHs6j75kJU94buiGZZN4PCJRZCI7te4Dfn0vA0ZOp1eN6B5RBcP90IpVCRQ0oxmIOBmsZA8KFRlmqctgPpPp19iQObJLxJqPPaki44LoGnaVm210ZXfFvmKuUMgiGUlVugYbZD85vFV1F
  3JVD61m61oiL1nNrOsPqce3bcdUZKNcsp5sAo6ZeJb0CM6Ljdc48o2oewuwjma3OUr2VrBhHHrK2B3qG9i3PUhNzzYV8kzHPe96JFnUWOjnL3ssLEbBkdb1DAKEv5eXhSJORSA7fD6Lq9qYVQnh5bAv6RGvNjs8R3fIbiWlJdoxdhGp6JhgkTuLAP2BxDzZ61epZbWsUGTSbiHCKcpqoweHdzdwCmLLrIgAhZuknnu6H6NUjy7FGGZvoG7KthRGx`
});


fastify.addHook('preHandler', async (request, reply) => {
  const rawUser = request.cookies.User;
  const rawSession = request.cookies.Session;

  if (!rawUser || !rawSession) {
    console.log('Cookies: Missing cookies');
    return;
  }

  const { value: username, valid: userValid } = request.unsignCookie(rawUser);
  const { value: sessionId, valid: sessionValid } = request.unsignCookie(rawSession);

  if (!userValid || !sessionValid) {
    console.log('Cookies: Invalid signed cookie(s)', { username, sessionId });
    reply.clearCookie('Session');
    reply.clearCookie('User');
    return reply.redirect('/error');
  }

  const validSession = userSessions.get(username);

  console.log(`Cookies: user=${username}, session=${sessionId}, expected=${validSession}`);

  if (validSession !== sessionId) {
    console.log(`Invalid session for user ${username}. Forcing logout.`);
    reply.clearCookie('Session');
    reply.clearCookie('User');
    return reply.redirect('/error');
  }
});

//register error handler
fastify.setErrorHandler((error, request, reply) => { errorHandler(error, request, reply) });

//register paths
fastify.register(async (instance) => {
  await register_paths(instance, userSessions);
}, { prefix: '/' });

fastify.register(settings_router, { prefix: '/st' });

fastify.register(resources_router, { prefix: '/r' });



//set up proxy paths
fastify.get("/uv/uv.config.js", (req, res) => {
  return res.sendFile("uv/uv.config.js", publicPath);
});

fastify.register(fastifyStatic, {
  root: uvPath,
  prefix: "/uv/",
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

//start server
fastify.server.on("listening", () => {
  const address = fastify.server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP/HTTPS server");
  fastify.close();
  process.exit(0);
}

//listening on default https port (http: 80, https: 443)
const PORT = process.env.PORT || 8080;

fastify.listen({
  port: PORT,
  host: "0.0.0.0"
});
