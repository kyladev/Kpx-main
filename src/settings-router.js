import { authMiddleware, publicPath } from './run-settings.js';

export default async function settings_router(fastify, options) {
    fastify.get("/", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/settings.html", publicPath);
        }
    });
    fastify.get("/u", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/settings-pages/settings-ui.html", publicPath);
        }
    });
    fastify.get("/cl", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/settings-pages/settings-cloaking.html", publicPath);
        }
    });
    fastify.get("/c", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/settings-pages/settings-color.html", publicPath);
        }
    });
    fastify.get("/p", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/settings-pages/settings-particles.html", publicPath);
        }
    });
}