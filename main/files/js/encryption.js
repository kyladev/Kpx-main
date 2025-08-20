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

export async function readBlobAsText(blob) {
  return new Promise((resolve, reject) => {
    // Create a new FileReader instance
    const reader = new FileReader();

    // Set up the onload event handler
    reader.onload = (event) => {
      // Resolve the promise with the result (the file's content)
      resolve(event.target.result);
    };

    // Set up the onerror event handler for error handling
    reader.onerror = (error) => {
      // Reject the promise if an error occurs
      reject(error);
    };

    // Read the blob as text
    reader.readAsText(blob);
  });
}

export async function fileRequest(e2ee, sid, fileId) {
  // Encrypt payload describing which file ID to fetch
  const payload = { type: 'getFile', id: fileId };
  const ct = await e2ee.encrypt(JSON.stringify(payload));

  const url = new URL('/e2ee/file', window.location.origin);
  url.searchParams.set('sid', sid);
  url.searchParams.set('ciphertext', ct);

  // Fetch file response
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`File request failed: ${res.status}`);
  }
  const { ciphertext } = await res.json();

  // Decrypt file data
  const pt = await e2ee.decrypt(ciphertext);
  const { filename, data } = JSON.parse(pt);

  // Convert base64 to Blob
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes]);

  try {
    const fileContent = await readBlobAsText(blob);
    console.log(`Contents of ${filename}:`, fileContent);
    // You can now use fileContent as the text string of your file
    return { filename, blob, fileContent }; // Return the content along with the filename and blob
  } catch (error) {
    console.error("Failed to read the blob:", error);
    return { filename, blob };
  }
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