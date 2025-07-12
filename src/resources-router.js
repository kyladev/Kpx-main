// note: only use path to project root during design/testing, the search function doesn't work on it.
//const publicPath = "/Users/kylakreal/Kproxy-main/";
//const publicPath = "/Users/kylakreal/Kproxy-main/Ultraviolet-Static/public";

import { authMiddleware, publicPath } from './run-settings.js';

export default async function resources_router(fastify, options) {
    fastify.get("/", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("files/pages/resources.html", publicPath);
        }
    });
    fastify.get("/g", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("files/pages/resource-pages/guides.html", publicPath);
        }
    });
    fastify.get("/l", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("files/pages/resource-pages/links.html", publicPath);
        }
    });
    fastify.get("/s", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("files/pages/resource-pages/sites.html", publicPath);
        }
    });
}