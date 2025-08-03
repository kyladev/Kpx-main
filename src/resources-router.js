import { authMiddleware, publicPath } from './run-settings.js';

export default async function resources_router(fastify, options) {
    fastify.get("/", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/resources.html", publicPath);
        }
    });
    fastify.get("/g", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/resource-pages/guides.html", publicPath);
        }
    });
    fastify.get("/l", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/resource-pages/links.html", publicPath);
        }
    });
    fastify.get("/s", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/resource-pages/sites.html", publicPath);
        }
    });
}