import { authMiddleware, authMiddlewareAdmin, publicPath, require_pass } from './run-settings.js';
import { readFile, appendFile } from 'fs/promises';
import crypto from 'node:crypto';
import path from "path";

//import user data (passwords, usernames, etc.)
const usersFilePath = path.join(process.cwd(), 'src/userdata.json');

export default async function register_paths(fastify, userSessions) {
    fastify.get("/s", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/search.html", publicPath);
        }
    });

    fastify.get("/", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/home.html", publicPath);
        }
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

    fastify.get("/sc", {
        preHandler: authMiddleware(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/security.html", publicPath);
        }
    });

    fastify.get("/error", (req, res) => {
        if (require_pass === false) {
            res.redirect('/');
        }
        else {
            return res.sendFile("main/files/pages/403.html", publicPath);
        }
    });

    // POST /error route
    fastify.post('/error', async (request, reply) => {
        const { user, pass } = request.body;

        try {
            const data = await readFile(usersFilePath, 'utf-8');
            const json = JSON.parse(data);
            const storedUser = json.Users?.[user];

            if (storedUser && storedUser.password === pass) {
                const sessionId = crypto.randomUUID();
                userSessions.set(user, sessionId);

                console.log("Cookie session:", sessionId);

                reply
                    .setCookie('Session', sessionId, {
                        signed: true,
                        maxAge: 3600,
                        httpOnly: true,
                        path: '/'
                    })
                    .setCookie('User', user, {
                        signed: true,
                        maxAge: 3600,
                        httpOnly: true,
                        path: '/'
                    });

                appendFile("src/logs.txt", `${user} has logged in: ${new Date()}\n`);
                console.log("sign in logged:", user, new Date());

                reply.type('text/html').send(`
        <script>
          window.location.href = "/";
        </script>
      `);
            } else {
                reply.redirect('/error');
            }
        } catch (err) {
            console.error("Login error:", err);
            reply.status(500).send("Internal Server Error");
        }
    });

    //server utility paths

    fastify.get('/admin/logs', {
        preHandler: authMiddlewareAdmin(),
        handler: async (request, reply) => {
            try {
                const logPath = path.join(__dirname, 'logs.txt');
                const data = await fs.promises.readFile(logPath, 'utf8');

                reply
                    .type('text/html')
                    .send(`
          <!DOCTYPE html>
          <html>
            <body>
              <pre>${data}</pre>
            </body>
          </html>
        `);
            } catch (err) {
                request.log.error(err);
                reply.code(500).send('Error reading log file');
            }
        }
    });

    fastify.get("/admin", {
        preHandler: authMiddlewareAdmin(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/utility/adminhub.html", publicPath);
        }
    });

    fastify.get("/admin/login", {
        preHandler: authMiddlewareAdmin(),
        handler: (req, res) => {
            return res.sendFile("main/files/pages/utility/adminlogin.html", publicPath);
        }
    });

    fastify.post('/admin/login', async (request, reply) => {
        const { user, pass } = request.body;

        try {
            const data = await readFile(usersFilePath, 'utf-8');
            const json = JSON.parse(data);
            const storedAdmin = json.Admins?.[user];

            if (storedAdmin && storedAdmin.password === pass) {
                const sessionId = crypto.randomUUID();
                console.log("Admin cookie session:", sessionId);

                reply
                    .setCookie('Session', sessionId, {
                        signed: true,
                        maxAge: 3600, // 1 hour
                        httpOnly: true,
                        path: '/admin'
                    })
                    .setCookie('User', user, {
                        signed: true,
                        maxAge: 3600,
                        httpOnly: true,
                        path: '/admin'
                    });

                await appendFile("src/logs.txt", `${user} has logged in on admin page: ${new Date()}\n`);
                console.log("Sign in on admin page logged:", user, new Date());

                reply.type('text/html').send(`
        <script>
          window.location.href = "/admin";
        </script>
      `);
            } else {
                reply.redirect('/admin/login');
            }
        } catch (err) {
            console.error("Admin login error:", err);
            reply.status(500).send("Internal Server Error");
        }
    });
}