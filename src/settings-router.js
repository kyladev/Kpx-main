// note: only use path to project root during design/testing, the search function doesn't work on it.
//const publicPath = "/Users/kylakreal/Kproxy-main/";
//const publicPath = "/Users/kylakreal/Kproxy-main/Ultraviolet-Static/public";

import { authMiddleware, publicPath } from './run-settings.js';

export default async function settings_router(fastify, options) {
    fastify.get("/", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("frontend-files/pages/settings.html", publicPath);
        }
    });
    fastify.get("/ui", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("frontend-files/pages/settings-pages/settings-ui.html", publicPath);
        }
    });
    fastify.get("/cloaking", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("frontend-files/pages/settings-pages/settings-cloaking.html", publicPath);
        }
    });
    fastify.get("/color", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("frontend-files/pages/settings-pages/settings-color.html", publicPath);
        }
    });
    fastify.get("/particles", {
        preHandler: authMiddleware(), // or false for test mode
        handler: (req, res) => {
            return res.sendFile("frontend-files/pages/settings-pages/settings-particles.html", publicPath);
        }
    });
}