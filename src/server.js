import { createServer } from "node:http";
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
//import user passwords and usernames
import { users, admins } from "./credentials.js";
import * as fs from 'node:fs';
import crypto from 'node:crypto';

export const userSessions = new Map(); // { username: sessionId }

const __dirname = join(fileURLToPath(import.meta.url), "..");

const fastify = Fastify({
	serverFactory: (handler) => {
		return createServer()
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
  secret: `5iudXgHUUMQhjUoUova9bGRF3GyupJCVnxAFcZE28aEmcpUUUYT81EiyFDZKJf7uGr2OHjSuAhk07YOEdEWC36g0M9S309U4kKWt0iBEELDq4tghh6riKWaEBENqSMKHDx9CxjqmEqBelQdfcjF03tHsRmdofdtSc3QqRze8ZaGJYelzsKnS11MxAQ9rx1udk3BEY6vqdWhQhXeluo1qQX8fNsvlNgN9
WANl5dPrn8bOD0thJMbP9F1DOjWQpvZU`,
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
  if (error.message === 'UserNotAuthorized') {
    reply
      .code(403)
      .type('text/html')
      .send("<h1>403 Forbidden</h1><p>You don't have permission to access this resource.</p>");
  } else {
    // fallback for unhandled errors
    reply
      .code(500)
      .type('text/html')
      .send('<h1>500 Server Error</h1><p>No verified cookie, a cookie was not read correctly, or there is a missing cookie.</p>');
  }
});

fastify.get("/uv/uv.config.js", (req, res) => {
	return res.sendFile("/uv/uv.config.js", publicPath);
});

fastify.get("/search", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/search.html", publicPath);
  }
});

fastify.get("/", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/home.html", publicPath);
  }
});

fastify.register(settings_router, { prefix: '/settings' });

fastify.register(resources_router, { prefix: '/resources' });

fastify.get("/apps", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/apps.html", publicPath);
  }
});

fastify.get("/apps/view", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/appview.html", publicPath);
  }
});

fastify.get("/tools", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/tools.html", publicPath);
  }
});

fastify.get("/tools/view", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/appview.html", publicPath);
  }
});

fastify.get("/games", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/games.html", publicPath);
  }
});

fastify.get("/games/play", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/gameview.html", publicPath);
  }
});

fastify.get("/bots", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/inprogress.html", publicPath);
  }
});

fastify.get("/info", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/info.html", publicPath);
  }
});

fastify.get("/info/changelog", {
  preHandler: authMiddleware(), // or false for test mode
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/changelog.html", publicPath);
  }
});

fastify.get("/error", (req, res) => {
	if (require_pass === false) {
		res.redirect('/');
	}
	else {
		return res.sendFile("frontend-files/pages/403.html", publicPath);
	}
});

// POST /error route
fastify.post('/error', async (request, reply) => {
  const { user, pass } = request.body;

  if (users[user] && users[user] === pass) {
    const sessionId = crypto.randomUUID();
    userSessions.set(user, sessionId);
    console.log("Cookie session:", sessionId);

    reply
      .setCookie('Session', sessionId, {
        signed: true,
        maxAge: 3600, // 1 hour
        httpOnly: true,
        path: '/'
      })
      .setCookie('User', user, {
        signed: true,
        maxAge: 3600,
        httpOnly: true,
        path: '/'
      });

    fs.appendFile("logs.txt", `${user} has logged in: ${new Date()}\n`, () => {
      console.log("sign in logged:", user, new Date());
    });

    reply.type('text/html').send(`
      <script>
        window.location.href = "/";
      </script>
    `);
  } else {
    reply.redirect('/error');
  }
});

//server utility paths

fastify.get('/admin/logs', {
  preHandler: authMiddlewareAdmin,
  handler: async (request, reply) => {
    const logPath = path.join(__dirname, './logs.txt');
    const data = await fs.promises.readFile(logPath, 'utf8');

    fs.readFile(logPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading log file:", err);
            return res.status(500).send("Error reading log file");
        }

        console.log("sending log files");

        reply.type('text/html').send(`
            <!DOCTYPE html>
            <html>
            <body>
                <pre>${data}</pre>
            </body>
            </html>
        `);
    });
  }
});

fastify.get("/admin", {
  preHandler: authMiddlewareAdmin(),
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/utility/adminhub.html", publicPath);
  }
});

fastify.get("/admin/login", {
  preHandler: authMiddlewareAdmin(),
  handler: (req, res) => {
    return res.sendFile("frontend-files/pages/utility/adminlogin.html", publicPath);
  }
});

fastify.post('/admin/login', async (request, reply) => {
  const { user, pass } = request.body;

  if (admins[user] && admins[user] === pass) {
    const sessionId = crypto.randomUUID();
    userSessions.set(user, sessionId);
    console.log("Admin cookie session:", sessionId);

    reply
      .setCookie('Session', sessionId, {
        signed: true,
        maxAge: 360, // 1 hour
        httpOnly: true,
        path: '/admin'
      })
      .setCookie('User', user, {
        signed: true,
        maxAge: 360,
        httpOnly: true,
        path: '/admin'
      });

    fs.appendFile("logs.txt", `${user} has logged in on admin page: ${new Date()}\n`, () => {
      console.log("sign in on admin page, logged:", user, new Date());
    });

    reply.type('text/html').send(`
      <script>
        window.location.href = "/admin";
      </script>
    `);
  } else {
    reply.redirect('/admin/login');
  }
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
	console.log("SIGTERM signal received: closing HTTP server");
	fastify.close();
	process.exit(0);
}

const PORT = process.env.PORT || 8080;

fastify.listen({
	port: PORT,
	host: "0.0.0.0",
});
