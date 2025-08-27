// Creates a random inert "do-nothing" element and appends it to <body>.
function appendRandomNoopElement() {
  const makers = [
    // Fully inert: not rendered, no scripts run.
    () => {
      const t = document.createElement('template');
      t.content.append(document.createComment('noop'));
      return t;
    },
    // Also inert: script with non-executable type.
    () => {
      const s = document.createElement('script');
      s.type = 'application/json';
      s.textContent = JSON.stringify({ noop: true });
      return s;
    },
    // Fallback: hidden + display:none to guarantee no layout impact.
    () => {
      const d = document.createElement('div');
      d.hidden = true;
      d.style.cssText = 'display:none!important;visibility:hidden!important;width:0;height:0;overflow:hidden;';
      d.setAttribute('aria-hidden', 'true');
      return d;
    }
  ];

  const el = makers[Math.floor(Math.random() * makers.length)]();
  // Unique-ish marker, useful if you ever want to find/remove it.
  try {
    el.dataset.noopId = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  } catch { el.dataset.noopId = Math.random().toString(36).slice(2); }

  document.body.appendChild(el);
  return el; // return it in case you want a handle.
}