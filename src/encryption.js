import { E2EE } from 'e2ee.js';
import { logToFile } from './run-settings.js';
import { readFile } from 'fs/promises'
import { require_pass } from './run-settings.js';
import { userSessions } from './server.js';
import { fileMap } from './filemap.js';
import path from 'path';

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