// note: only use path to project root during design/testing, the search function doesn't work on it.
//const publicPath = "/Users/kylakreal/Kproxy-main/";
//const publicPath = "/Users/kylakreal/Kproxy-main/Ultraviolet-Static/public";

import { authMiddleware, publicPath } from './run-settings.js';

export default async function resources_router(fastify, options) {
    fastify.get("/", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("frontend-files/pages/resources.html", publicPath);
        }
    });
    fastify.get("/guides", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("frontend-files/pages/resource-pages/guides.html", publicPath);
        }
    });
    fastify.get("/links", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("frontend-files/pages/resource-pages/links.html", publicPath);
        }
    });
    fastify.get("/sites", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("frontend-files/pages/resource-pages/sites.html", publicPath);
        }
    });
}