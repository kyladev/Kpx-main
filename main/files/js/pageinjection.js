

const scripttxt = `window.addEventListener('popstate', () => {
  parent.postMessage({ type: 'uv-navigate', url: location.href }, '*');
});

window.addEventListener('hashchange', () => {
  parent.postMessage({ type: 'uv-navigate', url: location.href }, '*');
});`;