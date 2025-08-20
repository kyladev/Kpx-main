import { authMiddleware, publicPath, require_pass, isUserLoggedIn, logToFile } from './run-settings.js';
import { readFile } from 'fs/promises';
import crypto from 'node:crypto';
import path from "path";
import bcrypt from "bcrypt";
import { loginSchema } from './sanitizer.js';

//import user data (passwords, usernames, etc.)
const usersFilePath = path.join(process.cwd(), 'src/userdata.json');

export default async function register_paths(fastify, userSessions) {
    fastify.get("/s", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/search.html", publicPath);
        }
    });

    fastify.get("/", async (req, res) => {
        const loggedIn = await isUserLoggedIn(req);

        if (!loggedIn) {
            return res.sendFile("main/files/frontend/home.html", publicPath);
        }

        return res.sendFile("main/files/pages/home.html", publicPath);
    });

    fastify.get("/a", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/apps.html", publicPath);
        }
    });

    fastify.get("/a/v", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/appview.html", publicPath);
        }
    });

    fastify.get("/t", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/tools.html", publicPath);
        }
    });

    fastify.get("/t/v", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/appview.html", publicPath);
        }
    });

    fastify.get("/g", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/games.html", publicPath);
        }
    });

    fastify.get("/g/p", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/gameview.html", publicPath);
        }
    });

    fastify.get("/b", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/inprogress.html", publicPath);
        }
    });

    fastify.get("/i", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/info.html", publicPath);
        }
    });

    fastify.get("/i/c", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/changelog.html", publicPath);
        }
    });

    fastify.get("/st", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/settings.html", publicPath);
        }
    });

    fastify.get("/sc", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/security.html", publicPath);
        }
    });

    fastify.get("/login", (req, res) => {
        if (require_pass === false) {
            res.redirect('/');
            logToFile('important', `TESTING: user redirected to homepage from ${request.ip} due to testing mode (password requirement is off, this is dangerous)\n`);
        }
        else {
            return res.sendFile("main/files/frontend/login.html", publicPath);
        }
    });

    fastify.get("/register", {
        handler: (req, res) => {
            return res.sendFile("main/files/frontend/register.html", publicPath);
        }
    });

    // POST /login route

    fastify.post('/login', async (request, reply) => {
        //sanitize input of login page
        const { error, value } = loginSchema.validate(request.body, { abortEarly: false });
        if (error) {
            //invalid input, redirect or return error
            logToFile("warning", `Validation failed from ${request.ip}, potential attack: ${error.details}`);
            return reply.redirect('/login');
        }

        //sanitized input set as username and password
        const { user, pass } = value;

        try {
            const data = await readFile(usersFilePath, 'utf-8');
            const json = JSON.parse(data);
            const storedUser = json.Users?.[user];

            if (storedUser) {
                // Compare the provided password with the stored hash
                const match = await bcrypt.compare(pass, storedUser.passwordHash);

                if (match) {
                    //update last login date
                    storedUser.lastlogin = new Date().toISOString();

                    // Passwords match, proceed with session logic
                    const sessionId = crypto.randomUUID();
                    userSessions.set(user, sessionId);

                    reply
                        .setCookie('Session', sessionId, { signed: true, httpOnly: true, path: '/' })
                        .setCookie('User', user, { signed: true, httpOnly: true, path: '/' })
                        .redirect('/');

                    logToFile("info", `${user} has logged in from ${request.ip}`);
                    console.log("sign in logged:", user, new Date());
                } else {
                    // Passwords do not match
                    reply.redirect('/login');
                }
            } else {
                // User not found
                reply.redirect('/login');
            }
        } catch (err) {
            logToFile("error", `Login error ${request.ip} due to ${err}`);
            console.error("Login error:", err);
            reply.status(500).send("Internal Server Error");
        }
    });
}