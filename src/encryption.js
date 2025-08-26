import { E2EE } from 'e2ee.js';
import { logToFile, rootPath } from './run-settings.js';
import { readFile } from 'fs/promises'
import { require_pass } from './run-settings.js';
import { userSessions } from './server.js';
import path from 'path';

const fileMap = {
    //fake frontend files
    'hf-html': 'main/files/frontend/home.html',
    'lf-html': 'main/files/frontend/login.html',
    'rf-html': 'main/files/frontend/register.html',
    'hf-favi': 'main/files/frontend/favicon.ico',
    //html files
    'h-html': 'main/files/pages/home.html',
    'a-html': 'main/files/pages/apps.html',
    'av-html': 'main/files/pages/appview.html',
    'c-html': 'main/files/pages/changelog.html',
    'em-html': 'main/files/pages/emptytab.html',
    'g-html': 'main/files/pages/games.html',
    'gv-html': 'main/files/pages/gameviewer.html',
    'i-html': 'main/files/pages/info.html',
    'r-html': 'main/files/pages/resources.html',
    's-html': 'main/files/pages/search.html',
    'sc-html': 'main/files/pages/security.html',
    'st-html': 'main/files/pages/settings.html',
    //css files
    'h-css': 'main/files/css/home.css',
    'a-css': 'main/files/css/apps.css',
    'n-css': 'main/files/css/nav.css',
    'p-css': 'main/files/css/particles.css',
    'r-css': 'main/files/css/req.css',
    'rs-css': 'main/files/css/resources.css',
    's-css': 'main/files/css/search.css',
    'st-css': 'main/files/css/settings.css',
    //js files
    'h-js': 'main/files/js/home.js',
    'c-js': 'main/files/js/cloak.js',
    'p-js': 'main/files/js/panic.js',
    'cl-js': 'main/files/js/color-load.js',
    'nnt-js': 'main/files/js/new-newtabs.js',
    'r-js': 'main/files/js/req.js',
    'sf-js': 'main/files/js/search-form.js',
    'sh-js': 'main/files/js/search-handler.js',
    'sl-js': 'main/files/js/search-load.js',
    'stcl-js': 'main/files/js/settings-cloak.js',
    'stc-js': 'main/files/js/settings-color.js',
    'stu-js': 'main/files/js/settings-ui.js',
    'st-js': 'main/files/js/settings.js',
    'lop-js': 'main/files/js/particles/load-options-particles.js',
    'pj-js': 'main/files/js/particles/particles-js.js',
    'sp-js': 'main/files/js/particles/settings-particles.js',
    //pagegen js files
    'a-pjs': 'main/files/pagegen-js/app-gen.js',
    'g-pjs': 'main/files/pagegen-js/games-gen.js',
    'nv1-pjs': 'main/files/pagegen-js/navbar-1-gen.js',
    'nv2-pjs': 'main/files/pagegen-js/navbar-2-gen.js',
    'scl-pjs': 'main/files/pagegen-js/settings-cloaking-gen.js',
    'sc-pjs': 'main/files/pagegen-js/settings-color-gen.js',
    'sp-pjs': 'main/files/pagegen-js/settings-particles-gen.js',
    'su-pjs': 'main/files/pagegen-js/settings-ui-gen.js',
    'hs-pjs': 'main/files/pagegen-js/lib/home-shortcuts.js',
    'is-pjs': 'main/files/pagegen-js/lib/icon-section.js',
    'rp-pjs': 'main/files/pagegen-js/lib/resource-pages.js',
    'ss-pjs': 'main/files/pagegen-js/lib/settings-sections.js',
    //UV files
    'uv-cl': 'main/uv.client.js',
    'uv-clm': 'main/uv.client.js.map',
    'uv-s': 'main/search.js',
    'uv-sw': 'main/sw.js',
    'uv-bn': 'main/uv.bundle.js',
    'uv-bnm': 'main/uv.bundle.js.map',
    'uv-cfg': 'main/uv.config.js',
    'uv-hd': 'main/uv.handler.js',
    'uv-hdm': 'main/uv.handler.js.map',
    'uv-usw': 'main/uv.sw.js',
    'uv-uswm': 'main/uv.sw.js.map',
    'uv-ix': 'main/index.js',
    'uv-rs': 'main/register-sw.js',
    //
    //IMAGES
    //
    'gl-png': 'main/files/assets/googlelogo.png',
    'bt-png': 'main/files/assets/bot.png',
    'chpt-png': 'main/files/assets/chatgpt-logo.jpg',
    'dsc-png': 'main/files/assets/discord-logo.png',
    'extp-png': 'main/files/assets/extprint3r.png',
    'frdns-png': 'main/files/assets/freedns.png',
    'gth-png': 'main/files/assets/githublogo.png',
    'hwai-png': 'main/files/assets/hwai.png',
    'mhai-png': 'main/files/assets/mathai.png',
    'plx-png': 'main/files/assets/plex.jpg',
    'qlbt-png': 'main/files/assets/quillbot.png',
    'sptf-png': 'main/files/assets/spotify.png',
    'twt-png': 'main/files/assets/twitch-logo.png',
    'vsc-png': 'main/files/assets/vscode.png',
    'wnd-png': 'main/files/assets/windows.jpg',
    'wndxp-png': 'main/files/assets/windowsxp.png',
};
const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
};

async function validateAuth(req, reply, { api = false } = {}) {
    if (require_pass === false) {
        logToFile(
            "important",
            `TESTING: cookie authentication bypassed by ${req.ip}`
        );
        return { ok: true, username: "test", sessionId: "test" };
    }

    if (!req.cookies.Session || !req.cookies.User) {
        if (api) {
            reply.code(401).send({ ok: false, error: "Unauthenticated" });
        } else {
            reply.redirect("/login");
        }
        return { ok: false };
    }

    const signedSession = req.unsignCookie(req.cookies.Session);
    const signedUser = req.unsignCookie(req.cookies.User);

    if (!signedSession?.valid || !signedUser?.valid) {
        logToFile(
            "info",
            `tampered or missing cookies from ${req.ip}`
        );
        reply.clearCookie("Session");
        reply.clearCookie("User");
        reply.redirect("/login");
        return { ok: false };
    }

    const sessionId = signedSession.value;
    const username = signedUser.value;

    if (userSessions.get(username) !== sessionId) {
        logToFile(
            "info",
            `User ${username} invalid/multiple sessions at ${req.ip}`
        );
        reply.clearCookie("Session");
        reply.clearCookie("User");
        reply.redirect("/login");
        return { ok: false };
    }

    return { ok: true, username, sessionId };
}

export default async function startEncryption(fastify) {

    logToFile('info', `starting encrytion backend`);

    const sessions = new Map(); //sid -> E2EE instance

    fastify.post("/session/init", async (req, reply) => {
        const auth = await validateAuth(req, reply, { api: true });
        if (!auth.ok) {
            reply.code(401).send({ ok: false, error: "unauthorized" });
            return { ok: false };
        }

        const { sid, clientPub } = req.body;
        const e2ee = new E2EE();
        await e2ee.generateKeyPair();
        await e2ee.setRemotePublicKey(clientPub);
        const serverPub = await e2ee.exportPublicKey();

        sessions.set(sid, e2ee);
        reply.send({ serverPub });
    });

    //generic POST handler (encrypted)
    fastify.post('/e2ee', async (req, reply) => {
        const auth = await validateAuth(req, reply, { api: true });
        if (!auth.ok) {
            reply.code(401).send({ ok: false, error: "unauthorized" });
            return { ok: false };
        }

        const { sid, ciphertext } = req.body;
        const e2ee = sessions.get(sid);
        if (!e2ee) return reply.code(403).send();

        try {
            const decrypted = await e2ee.decrypt(ciphertext);
            const payload = JSON.parse(decrypted);

            // --- Example app logic ---
            let response;
            if (payload.type === 'newPost') {
                // Simulate writing to DB
                response = { ok: true, response: 'Response Successful' };
            } else {
                response = { ok: false, error: 'unknown request' };
            }

            const encResp = await e2ee.encrypt(JSON.stringify(response));
            reply.send({ sid, ciphertext: encResp });
        } catch {
            reply.code(400).send();
            logToFile('warning', `unexpected encryption header for POST request from ${request.ip}`);
        }
    });

    // Generic GET handler (encrypted query)
    fastify.get('/e2ee', async (req, reply) => {
        const auth = await validateAuth(req, reply, { api: true });
        if (!auth.ok) {
            reply.code(401).send({ ok: false, error: "unauthorized" });
            return { ok: false };
        }

        const { sid, ciphertext } = req.query;
        const e2ee = sessions.get(sid);
        if (!e2ee) return reply.code(403).send();

        try {
            const decrypted = await e2ee.decrypt(ciphertext);
            const payload = JSON.parse(decrypted);

            // --- Example app logic ---
            let response;
            if (payload.type === 'newRequest') {
                response = { id: payload.id, response: 'Response Successful' };
            } else {
                response = { ok: false, error: 'unknown request' };
            }

            const encResp = await e2ee.encrypt(JSON.stringify(response));
            reply.send({ sid, ciphertext: encResp });
        } catch {
            reply.code(400).send();
            logToFile('warning', `unexpected encryption header for GET request from ${request.ip}`);
        }
    });
    fastify.get('/e2ee/file', async (req, reply) => {
        const auth = await validateAuth(req, reply, { api: true });
        if (!auth.ok) {
            reply.code(401).send({ ok: false, error: "unauthorized" });
            return { ok: false };
        }

        const { sid, ciphertext } = req.query;
        const e2ee = sessions.get(sid);
        if (!e2ee) return reply.code(403).send();

        try {
            const decrypted = await e2ee.decrypt(ciphertext);
            const payload = JSON.parse(decrypted);

            if (payload.type !== 'getFile' || !payload.id || !fileMap[payload.id]) {
                return reply.code(400).send({ error: 'invalid request' });
            }

            // Read the mapped file
            const fileBuffer = await readFile(fileMap[payload.id]);
            const base64File = fileBuffer.toString('base64');


            const response = {
                filename: fileMap[payload.id].split('/').pop(),
                data: base64File
            };

            const encResp = await e2ee.encrypt(JSON.stringify(response));
            reply.send({ sid, ciphertext: encResp });

        } catch (err) {
            logToFile('error', `file transfer failed: ${err.message}`);
            reply.code(400).send();
        }
    });
    fastify.get('/e2ee/image', async (req, reply) => {
        const auth = await validateAuth(req, reply, { api: true });
        if (!auth.ok) {
            reply.code(401).send({ ok: false, error: "unauthorized" });
            return { ok: false };
        }

        const { sid, ciphertext } = req.query;
        const e2ee = sessions.get(sid);
        if (!e2ee) return reply.code(403).send();

        try {
            const decrypted = await e2ee.decrypt(ciphertext);
            const payload = JSON.parse(decrypted);

            if (payload.type !== 'getFile' || !payload.id || !fileMap[payload.id]) {
                return reply.code(400).send({ error: 'invalid request' });
            }

            const filePath = fileMap[payload.id];
            const fileExtension = path.extname(filePath).toLowerCase();
            const mimeType = mimeTypes[fileExtension] || 'application/octet-stream';

            const fileBuffer = await readFile(filePath);
            const base64File = fileBuffer.toString('base64');

            const response = {
                filename: path.basename(filePath),
                mimeType: mimeType,
                data: base64File
            };

            const encResp = await e2ee.encrypt(JSON.stringify(response));
            reply.send({ sid, ciphertext: encResp });

        } catch (err) {
            logToFile('error', `file transfer failed: ${err.message}`);
            reply.code(400).send();
        }
    });
}