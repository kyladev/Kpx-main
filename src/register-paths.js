import { authMiddleware, rootPath, require_pass, isUserLoggedIn, logToFile } from './run-settings.js';
import { readFile, writeFile } from 'fs/promises';
import crypto from 'node:crypto';
import path from "path";
import bcrypt from "bcrypt";
import { loginSchema } from './sanitizer.js';
import { readFileSync } from 'node:fs';

//template for page to securely get the main HTML doc
const template = readFileSync("src/getpage.html", "utf8");

//import user data
const usersFilePath = path.join(process.cwd(), 'src/userdata.json');

export default async function register_paths(fastify, userSessions) {
    fastify.get("/s", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            const html = template.replace("__PAGE_ID__", "s-html");
            return res.type("text/html").send(html);
        }
    });

    fastify.get("/", async (req, res) => {
        const loggedIn = await isUserLoggedIn(req);

        if (!loggedIn) {
            return res.sendFile("public/home.html", rootPath);
        }

        const html = template.replace("__PAGE_ID__", "h-html");
        return res.type("text/html").send(html);
    });

    fastify.get("/a", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            const html = template.replace("__PAGE_ID__", "a-html");
            return res.type("text/html").send(html);
        }
    });

    fastify.get("/a/v", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            const html = template.replace("__PAGE_ID__", "av-html");
            return res.type("text/html").send(html);
        }
    });

    fastify.get("/g", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            const html = template.replace("__PAGE_ID__", "g-html");
            return res.type("text/html").send(html);
        }
    });

    fastify.get("/g/p", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            const html = template.replace("__PAGE_ID__", "gv-html");
            return res.type("text/html").send(html);
        }
    });

    fastify.get("/i", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            const html = template.replace("__PAGE_ID__", "i-html");
            return res.type("text/html").send(html);
        }
    });

    fastify.get("/st", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            const html = template.replace("__PAGE_ID__", "st-html");
            return res.type("text/html").send(html);
        }
    });

    fastify.get("/sc", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            const html = template.replace("__PAGE_ID__", "sc-html");
            return res.type("text/html").send(html);
        }
    });

    fastify.get("/login", (req, res) => {
        if (require_pass === false) {
            res.redirect('/');
            logToFile('important', `TESTING: user redirected to homepage from ${request.ip} due to testing mode (password requirement is off, this is dangerous)\n`);
        }
        else {
            return res.sendFile("public/login.html", rootPath);
        }
    });

    fastify.get("/register", {
        handler: (req, res) => {
            return res.sendFile("public/register.html", rootPath);
        }
    });

    //POST /login route
    fastify.post('/login', async (request, reply) => {
        //sanitize input of login page
        const { error, value } = loginSchema.validate(request.body, { abortEarly: false });
        if (error) {
            //invalid credenitals, if there is an error, somebody may be trying attack/break into the site
            logToFile("warning", `Validation failed from ${request.ip}, potential attack: ${error.details}`);
            return reply.redirect('/login');
        }

        //sanitized input as username and password
        const { user, pass } = value;

        try {
            const data = await readFile(usersFilePath, 'utf-8');
            const json = JSON.parse(data);
            const storedUser = json.Users?.[user];

            if (storedUser) {
                //compare with stored hash
                const match = await bcrypt.compare(pass, storedUser.passwordHash);

                if (match) {
                    //update last login date (unix time)
                    storedUser.lastlogin = Math.floor(Date.now() / 1000);
                    const updatedJson = JSON.stringify(json, null, 2);
                    writeFile(usersFilePath, updatedJson, 'utf-8');

                    const sessionId = crypto.randomUUID();
                    userSessions.set(user, sessionId);

                    reply
                        .setCookie('Session', sessionId, { signed: true, httpOnly: true, path: '/' })
                        .setCookie('User', user, { signed: true, httpOnly: true, path: '/' })
                        .redirect('/');

                    logToFile("info", `${user} has logged in from ${request.ip}`);
                    console.log("sign in logged:", user, new Date());
                } else {
                    //passwords don't match
                    reply.redirect('/login');
                }
            } else {
                //user not found
                reply.redirect('/login');
            }
        } catch (err) {
            //error, something went wrong in the backend (probably)
            logToFile("error", `Login error ${request.ip} due to ${err}`);
            console.error("Login error:", err);
            reply.status(500).send("Internal Server Error");
        }
    });
}