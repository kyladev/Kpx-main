import { E2EE } from './e2ee/dist/e2ee.esm.js';


export async function initSession(sid) {
  const e2ee = new E2EE();
  await e2ee.generateKeyPair();
  const clientPub = await e2ee.exportPublicKey();

  const res = await fetch('/session/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sid, clientPub })
  });
  const { serverPub } = await res.json();

  await e2ee.setRemotePublicKey(serverPub);
  return e2ee;
}

export async function postRequest(e2ee, sid, payload) {
  const ct = await e2ee.encrypt(JSON.stringify(payload));
  const res = await fetch('/e2ee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sid, ciphertext: ct })
  });
  const { ciphertext } = await res.json();
  const pt = await e2ee.decrypt(ciphertext);
  return JSON.parse(pt);
}

export async function getRequest(e2ee, sid, payload) {
  const ct = await e2ee.encrypt(JSON.stringify(payload));
  const url = new URL('/e2ee', window.location.origin);
  url.searchParams.set('sid', sid);
  url.searchParams.set('ciphertext', ct);

  const res = await fetch(url);
  const { ciphertext } = await res.json();
  const pt = await e2ee.decrypt(ciphertext);
  return JSON.parse(pt);
}

// example usage
// (async () => {
//   const sid = crypto.randomUUID();
//   const e2ee = await initSession(sid);

//   const postResp = await postRequest(e2ee, sid, { type: 'newPost', content: 'hello world' });
//   console.log('POST response:', postResp);

//   const getResp = await getRequest(e2ee, sid, { type: 'getUser', id: 123 });
//   console.log('GET response:', getResp);
// })();