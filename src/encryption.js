import { E2EE } from 'e2ee.js';
import { logToFile } from './run-settings.js';

export default async function startEncryption(fastify) {

    logToFile('info', `starting encrytion backend`);

    const sessions = new Map(); //sid -> E2EE instance

    //bootstrap a session with public key exchange
    fastify.post('/session/init', async (req, reply) => {
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
                response = { ok: false, error: 'unknown request'};
            }

            const encResp = await e2ee.encrypt(JSON.stringify(response));
            reply.send({ sid, ciphertext: encResp });
        } catch {
            reply.code(400).send();
            logToFile('warning', `unexpected encryption header for GET request from ${request.ip}`);
        }
    });
}
