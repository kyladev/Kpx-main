import { E2EE } from '/e2ee/dist/e2ee.esm.js';


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
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(blob);
  });
}

export async function fileRequest(e2ee, sid, fileId) {
  const payload = { type: 'getFile', id: fileId };
  const ct = await e2ee.encrypt(JSON.stringify(payload));

  const url = new URL('/e2ee/file', window.location.origin);
  url.searchParams.set('sid', sid);
  url.searchParams.set('ciphertext', ct);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`File request failed: ${res.status}`);

  const { ciphertext } = await res.json();

  const pt = await e2ee.decrypt(ciphertext);
  const { filename, data } = JSON.parse(pt);

  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes]);

  const extension = filename.split('.').pop().toLowerCase();

  let text
  switch (extension) {
    case 'css':
    case 'html':
    case 'js':
      text = readBlobAsText(blob);
      return { filename, blob, content: text };
    case 'txt':
      text = readBlobAsText(blob);
      return { filename, blob, content: text };
    case 'json':
      text = await readBlobAsText(blob);
      const json = JSON.parse(text);
      return { filename, blob, content: json };
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return { filename, blob };

    default:
      try {
        text = await readBlobAsText(blob);
        return { filename, blob, content: text };
      } catch {
        return { filename, blob };
      }
  }
}

export async function injectFileContentToDOM(e2ee, sid, fileId, target) {
  const { filename, content } = await fileRequest(e2ee, sid, fileId);
  const extension = filename.split('.').pop().toLowerCase();

  if (!target) throw new Error(`Target element "${target}" not found`);

  const resolvedContent = typeof content === 'string' ? content : await content;

  switch (extension) {
    case 'css':
      if (target.tagName.toLowerCase() === 'style') {
        target.textContent = resolvedContent;
      } else {
        throw new Error(`Expected a <style> element for CSS injection`);
      }
      break;

    case 'js':
      if (target.tagName.toLowerCase() === 'script') {
        target.textContent = resolvedContent;
      } else {
        throw new Error(`Expected a <script> element for JS injection`);
      }
      break;

    default:
      throw new Error(`Unsupported file type for DOM injection: ${extension}`);
  }

  return { filename, injected: true };
}

export async function injectHtmlFileToDOM(e2ee, sid, fileId, target) {
  const { filename, content } = await fileRequest(e2ee, sid, fileId);
  const extension = filename.split('.').pop().toLowerCase();

  if (extension !== 'html') {
    throw new Error(`Only HTML files can be injected with this function`);
  }

  if (!target) throw new Error(`Target element "${target}" not found`);

  let resolvedContent;
  if (typeof content === 'string') {
    resolvedContent = content;
  } else if (content instanceof Blob) {
    resolvedContent = await content.text();
  } else {
    resolvedContent = await content;
  }

  if (target === document) {
    document.open();
    document.write(resolvedContent);
    document.close();
  } else {
    if (target.tagName.toLowerCase() !== 'iframe') {
      throw new Error(`Target element must be an <iframe> or document`);
    }

    const blob = new Blob([resolvedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    target.src = url;

    target.onload = () => URL.revokeObjectURL(url);
  }

  return { filename, injected: true };
}

export async function imageRequest(e2ee, sid, fileId) {
  const payload = { type: 'getFile', id: fileId };
  const ct = await e2ee.encrypt(JSON.stringify(payload));

  const url = new URL('/e2ee/image', window.location.origin);
  url.searchParams.set('sid', sid);
  url.searchParams.set('ciphertext', ct);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`File request failed: ${res.status}`);

  const { ciphertext } = await res.json();

  const pt = await e2ee.decrypt(ciphertext);
  const { filename, mimeType, data } = JSON.parse(pt);

  return { filename, mimeType, data };
}

export async function injectImageToDOM(e2ee, sid, fileId, target) {
  const { filename, mimeType, data } = await imageRequest(e2ee, sid, fileId);

  if (!target || target.tagName.toLowerCase() !== 'img') {
    throw new Error('Target element must be an <img> tag.');
  }

  const dataUri = `data:${mimeType};base64,${data}`;

  target.src = dataUri;

  return { filename, injected: true };
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