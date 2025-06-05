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
import { authMiddleware, publicPath, require_pass } from './run-settings.js';
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
//import user passwords and usernames
import { users } from "./credentials.js";
import * as fs from 'node:fs';


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

await fastify.register(fastifyCookie);
await fastify.register(fastifyFormbody);

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
    console.log("User logged in:", user);

    reply.setCookie('Session', 'Valid', {
      maxAge: 3600, // 1 hour
      httpOnly: false,
      path: '/'
    });

    fs.appendFile("logs.txt", user + " has logged in:" + new Date + "\n", ()=> {
        console.log("sign in logged, " + user + ": " + new Date);
    });

    reply.type('text/html').send(`
      <script>
        window.location.href = "/";
      </script>
    `);
  } else {
    // Optional: Add feedback to the error page
    reply.redirect('/error');
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

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

PORT = 8080;

fastify.listen({
	port: PORT,
	host: "0.0.0.0",
});
