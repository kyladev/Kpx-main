import { E2EE } from 'e2ee.js';
import { logToFile } from './run-settings.js';
import { readFile } from 'fs/promises'
import { require_pass } from './run-settings.js';
import { userSessions } from './server.js';
import path from 'path';

const fileMap = {
    //fake frontend files
    'hf-html': 'main/frontend/home.html',
    'lf-html': 'main/frontend/login.html',
    'rf-html': 'main/frontend/register.html',
    'hf-favi': 'main/frontend/favicon.ico',
    //html files
    'h-html': 'main/pages/home.html',
    'a-html': 'main/pages/apps.html',
    'av-html': 'main/pages/appview.html',
    'c-html': 'main/pages/changelog.html',
    'em-html': 'main/pages/emptytab.html',
    'g-html': 'main/pages/games.html',
    'gv-html': 'main/pages/gameviewer.html',
    'i-html': 'main/pages/info.html',
    'r-html': 'main/pages/resources.html',
    's-html': 'main/pages/search.html',
    'sc-html': 'main/pages/security.html',
    'st-html': 'main/pages/settings.html',
    //css files
    'h-css': 'main/css/home.css',
    'a-css': 'main/css/apps.css',
    'n-css': 'main/css/nav.css',
    'p-css': 'main/css/particles.css',
    'r-css': 'main/css/req.css',
    'rs-css': 'main/css/resources.css',
    's-css': 'main/css/search.css',
    'st-css': 'main/css/settings.css',
    //js files
    'h-js': 'main/js/home.js',
    'c-js': 'main/js/cloak.js',
    'p-js': 'main/js/panic.js',
    'cl-js': 'main/js/color-load.js',
    'nnt-js': 'main/js/new-newtabs.js',
    'r-js': 'main/js/req.js',
    'sf-js': 'main/js/search-form.js',
    'sh-js': 'main/js/search-handler.js',
    'sl-js': 'main/js/search-load.js',
    'stcl-js': 'main/js/settings-cloak.js',
    'stc-js': 'main/js/settings-color.js',
    'stu-js': 'main/js/settings-ui.js',
    'st-js': 'main/js/settings.js',
    'lop-js': 'main/js/particles/load-options-particles.js',
    'pj-js': 'main/js/particles/particles-js.js',
    'sp-js': 'main/js/particles/settings-particles.js',
    //pagegen js files
    'a-pjs': 'main/pagegen-js/app-gen.js',
    'g-pjs': 'main/pagegen-js/games-gen.js',
    'nv1-pjs': 'main/pagegen-js/navbar-1-gen.js',
    'nv2-pjs': 'main/pagegen-js/navbar-2-gen.js',
    'scl-pjs': 'main/pagegen-js/settings-cloaking-gen.js',
    'sc-pjs': 'main/pagegen-js/settings-color-gen.js',
    'sp-pjs': 'main/pagegen-js/settings-particles-gen.js',
    'su-pjs': 'main/pagegen-js/settings-ui-gen.js',
    'hs-pjs': 'main/pagegen-js/lib/home-shortcuts.js',
    'is-pjs': 'main/pagegen-js/lib/icon-section.js',
    'rp-pjs': 'main/pagegen-js/lib/resource-pages.js',
    'ss-pjs': 'main/pagegen-js/lib/settings-sections.js',
    //UV files
    'uv-cl': 'main/uv-js/uv.client.js',
    'uv-clm': 'main/uv-js/uv.client.js.map',
    'uv-s': 'main/uv-js/search.js',
    'uv-sw': 'main/uv-js/sw.js',
    'uv-bn': 'main/uv-js/uv.bundle.js',
    'uv-bnm': 'main/uv-js/uv.bundle.js.map',
    'uv-cfg': 'main/uv-js/uv.config.js',
    'uv-hd': 'main/uv-js/uv.handler.js',
    'uv-hdm': 'main/uv-js/uv.handler.js.map',
    'uv-usw': 'main/uv-js/uv.sw.js',
    'uv-uswm': 'main/uv-js/uv.sw.js.map',
    'uv-ix': 'main/uv-js/index.js',
    'uv-rs': 'main/uv-js/register-sw.js',
    //IMAGES
    'gl-png': 'main/assets/googlelogo.png',
    'bt-png': 'main/assets/bot.png',
    'chpt-png': 'main/assets/chatgpt-logo.jpg',
    'dsc-png': 'main/assets/discord-logo.png',
    'extp-png': 'main/assets/extprint3r.png',
    'frdns-png': 'main/assets/freedns.png',
    'gth-png': 'main/assets/githublogo.png',
    'hwai-png': 'main/assets/hwai.png',
    'mhai-png': 'main/assets/mathai.png',
    'plx-png': 'main/assets/plex.jpg',
    'qlbt-png': 'main/assets/quillbot.png',
    'sptf-png': 'main/assets/spotify.png',
    'twt-png': 'main/assets/twitch-logo.png',
    'vsc-png': 'main/assets/vscode.png',
    'wnd-png': 'main/assets/windows.jpg',
    'wndxp-png': 'main/assets/windowsxp.png',
    //game images
    'cl-img': 'main/g-lib/celeste/celeste.png',
    '28-img': 'main/g-lib/2048/2048.png',
    'swpr-img': 'main/g-lib/minesweeper/minesweeper.png',
    'trs-img': 'main/g-lib/tetris/assets/blocks/custom/square.png'
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