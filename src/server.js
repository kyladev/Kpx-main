import { createServer } from "node:https";
import { join } from "node:path";
import { hostname } from "node:os";
import wisp from "wisp-server-node";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from 'url';
import settings_router from "./settings-router.js";
import resources_router from "./resources-router.js";
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import { authMiddleware, authMiddlewareAdmin, publicPath, require_pass } from './run-settings.js';
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { readFile, appendFile } from 'fs/promises';
import * as fs from 'node:fs';
import crypto from 'node:crypto';
import tls from 'tls';
import constants from 'node:constants';

//import user passwords and usernames as path to JSON file
const usersFilePath = path.join(process.cwd(), 'src/userdata.json');

export const userSessions = new Map(); // { username: sessionId }

const __dirname = join(fileURLToPath(import.meta.url), "..");

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
  https: httpsOptions,
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
    console.log('Missing cookies, skipping validation');
    return;
  }

  const { value: username, valid: userValid } = request.unsignCookie(rawUser);
  const { value: sessionId, valid: sessionValid } = request.unsignCookie(rawSession);

  if (!userValid || !sessionValid) {
    console.log('Invalid signed cookie(s)');
    reply.clearCookie('Session');
    reply.clearCookie('User');
    return reply.redirect('/error');
  }

  console.log('User:', username);
  console.log('Session from cookie:', sessionId);

  const validSession = userSessions.get(username);
  console.log('Expected session:', validSession);

  if (validSession !== sessionId) {
    console.log(`Invalid session for user ${username}. Forcing logout.`);
    reply.clearCookie('Session');
    reply.clearCookie('User');
    return reply.redirect('/error');
  }
});

fastify.setErrorHandler((error, request, reply) => {
  // fallback for unhandled errors
  if (error.message === 'UserNotAuthorized') {
    reply
      .code(403)
      .type('text/html')
      .send("<h1>403 Forbidden</h1><p>You don't have permission to access this resource.</p>");
  } else {
    reply
      //shows for any user going to a page that needs a cookie without one
      .code(500)
      .type('text/html')
      .send('<h1>500 Server Error</h1><p>No verified cookie, a cookie was not read correctly, or there is a missing cookie.</p>');
  }
});

fastify.get("/uv/uv.config.js", (req, res) => {
	return res.sendFile("/uv/uv.config.js", publicPath);
});

fastify.get("/s", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/search.html", publicPath);
  }
});

fastify.get("/", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/home.html", publicPath);
  }
});

fastify.register(settings_router, { prefix: '/st' });

fastify.register(resources_router, { prefix: '/r' });

fastify.get("/a", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/apps.html", publicPath);
  }
});

fastify.get("/a/v", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/appview.html", publicPath);
  }
});

fastify.get("/t", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/tools.html", publicPath);
  }
});

fastify.get("/t/v", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/appview.html", publicPath);
  }
});

fastify.get("/g", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/games.html", publicPath);
  }
});

fastify.get("/g/p", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/gameview.html", publicPath);
  }
});

fastify.get("/b", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/inprogress.html", publicPath);
  }
});

fastify.get("/i", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/info.html", publicPath);
  }
});

fastify.get("/i/c", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/changelog.html", publicPath);
  }
});

fastify.get("/sc", {
  preHandler: authMiddleware(),
  handler: (req, res) => {
    return res.sendFile("files/pages/security.html", publicPath);
  }
});

fastify.get("/error", (req, res) => {
	if (require_pass === false) {
		res.redirect('/');
	}
	else {
		return res.sendFile("files/pages/403.html", publicPath);
	}
});

// POST /error route
fastify.post('/error', async (request, reply) => {
  const { user, pass } = request.body;

  try {
    const data = await readFile(usersFilePath, 'utf-8');
    const json = JSON.parse(data);
    const storedUser = json.Users?.[user];

    if (storedUser && storedUser.password === pass) {
      const sessionId = crypto.randomUUID();
      userSessions.set(user, sessionId);

      console.log("Cookie session:", sessionId);

      reply
        .setCookie('Session', sessionId, {
          signed: true,
          maxAge: 3600,
          httpOnly: true,
          path: '/'
        })
        .setCookie('User', user, {
          signed: true,
          maxAge: 3600,
          httpOnly: true,
          path: '/'
        });

      await appendFile("logs.txt", `${user} has logged in: ${new Date()}\n`);
      console.log("sign in logged:", user, new Date());

      reply.type('text/html').send(`
        <script>
          window.location.href = "/";
        </script>
      `);
    } else {
      reply.redirect('/error');
    }
  } catch (err) {
    console.error("Login error:", err);
    reply.status(500).send("Internal Server Error");
  }
});

//server utility paths

fastify.get('/admin/logs', {
  preHandler: authMiddlewareAdmin(),
  handler: async (request, reply) => {
    try {
      const logPath = path.join(__dirname, 'logs.txt');
      const data = await fs.promises.readFile(logPath, 'utf8');

      reply
        .type('text/html')
        .send(`
          <!DOCTYPE html>
          <html>
            <body>
              <pre>${data}</pre>
            </body>
          </html>
        `);
    } catch (err) {
      request.log.error(err);
      reply.code(500).send('Error reading log file');
    }
  }
});

fastify.get("/admin", {
  preHandler: authMiddlewareAdmin(),
  handler: (req, res) => {
    return res.sendFile("files/pages/utility/adminhub.html", publicPath);
  }
});

fastify.get("/admin/login", {
  preHandler: authMiddlewareAdmin(),
  handler: (req, res) => {
    return res.sendFile("files/pages/utility/adminlogin.html", publicPath);
  }
});

fastify.post('/admin/login', async (request, reply) => {
  const { user, pass } = request.body;

  try {
    const data = await readFile(usersFilePath, 'utf-8');
    const json = JSON.parse(data);
    const storedAdmin = json.Admins?.[user];

    if (storedAdmin && storedAdmin.password === pass) {
      const sessionId = crypto.randomUUID();
      console.log("Admin cookie session:", sessionId);

      reply
        .setCookie('Session', sessionId, {
          signed: true,
          maxAge: 3600, // 1 hour
          httpOnly: true,
          path: '/admin'
        })
        .setCookie('User', user, {
          signed: true,
          maxAge: 3600,
          httpOnly: true,
          path: '/admin'
        });

      await appendFile("logs.txt", `${user} has logged in on admin page: ${new Date()}\n`);
      console.log("Sign in on admin page logged:", user, new Date());

      reply.type('text/html').send(`
        <script>
          window.location.href = "/admin";
        </script>
      `);
    } else {
      reply.redirect('/admin/login');
    }
  } catch (err) {
    console.error("Admin login error:", err);
    reply.status(500).send("Internal Server Error");
  }
});


fastify.register(fastifyStatic, {
	root: uvPath,
	prefix: "/core/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: epoxyPath,
	prefix: "/core/epoxy/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: baremuxPath,
	prefix: "/core/baremux/",
	decorateReply: false,
});

fastify.server.on("listening", () => {
	const address = fastify.server.address();

	// by default we are listening on 0.0.0.0 (every interface)
	// we just need to list a few
	console.log("Listening on:");
	console.log(`\thttp://localhost:${address.port}`);
	console.log(`\thttp://${hostname()}:${address.port}`);
	console.log(
		`\thttp://${
			address.family === "IPv6" ? `[${address.address}]` : address.address
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
const PORT = process.env.PORT || 443;

fastify.listen({
	port: PORT,
	host: "0.0.0.0"
});
