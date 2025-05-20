import { createServer } from "node:http";
import { join } from "node:path";
import { hostname } from "node:os";
import wisp from "wisp-server-node";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static paths
//const publicPath = "/Users/kylakreal/Kproxy-main/lib";
const publicPath = "/Users/kylakreal/Kproxy-main/Ultraviolet-Static/public";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

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

fastify.get("/uv/uv.config.js", (req, res) => {
	return res.sendFile("/uv/uv.config.js", publicPath);
});

fastify.get("/search", (req, res) => {
	return res.sendFile("frontend-files/pages/search.html", publicPath);
});

fastify.get("/searchtemp", (req, res) => {
	return res.sendFile("index.html", publicPath);
});

fastify.get("/", (req, res) => {
	return res.sendFile("frontend-files/pages/home.html", publicPath);
});

fastify.get("/settings", (req, res) => {
	return res.sendFile("frontend-files/pages/settings.html", publicPath);
});

fastify.get("/apps", (req, res) => {
	return res.sendFile("frontend-files/pages/apps.html", publicPath);
});

fastify.get("/tools", (req, res) => {
	return res.sendFile("frontend-files/pages/tools.html", publicPath);
});

fastify.get("/games", (req, res) => {
	return res.sendFile("frontend-files/pages/games.html", publicPath);
});

fastify.get("/games/play", (req, res) => {
	return res.sendFile("frontend-files/pages/gameview.html", publicPath);
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

fastify.listen({
	port: port,
	host: "0.0.0.0",
});
