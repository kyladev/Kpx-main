import { existsSync, readFileSync } from "fs";
import { createServer as httpCreateServer } from "node:http";
import { createServer as httpsCreateServer } from "node:https";
import { TLS_CERT, TLS_KEY } from "./run-settings.js";
import pkg from "http-proxy";
const { createProxyServer } = pkg;

export function startReverseProxy({
  target = "http://127.0.0.1:8080",
  enableHttpRedirect = true,
  tlsKey = TLS_KEY,
  tlsCert = TLS_CERT,
  tlsCa = "",
} = {}) {
  const proxy = createProxyServer({
    target,
    changeOrigin: true,
    xfwd: true,
    ws: true,
    ignorePath: false,
    secure: false,
    preserveHeaderKeyCase: true,
  });

  proxy.on("error", (err, req, res) => {
    const msg = `Proxy error: ${err.message}`;
    if (res && !res.headersSent) {
      res.writeHead(502, { "Content-Type": "text/plain" });
    }
    if (res) res.end(msg);
    console.error(msg);
  });

  if (enableHttpRedirect) {
    const httpServer = httpCreateServer((req, res) => {
      const host = req.headers.host ? req.headers.host.replace(/:\d+$/, "") : "localhost";
      const loc = `https://${host}${req.url}`;
      res.writeHead(301, { Location: loc });
      res.end();
    });

    httpServer.listen(80, () =>
      console.log(`[HTTP ] redirect server on :80 → 443`)
    );
  }

  function loadTLS() {
    if (!existsSync(tlsKey) || !existsSync(tlsCert)) {
      console.error("Missing TLS files for proxy");
      process.exit(1);
    }
    const opts = {
      key: readFileSync(tlsKey),
      cert: readFileSync(tlsCert),
    };
    if (tlsCa && existsSync(tlsCa)) {
      opts.ca = readFileSync(tlsCa);
    }
    return opts;
  }

  const httpsServer = httpsCreateServer(loadTLS(), (req, res) => {
    req.headers["x-forwarded-proto"] = "https";
    proxy.web(req, res);
  });

  httpsServer.on("upgrade", (req, socket, head) => {
    req.headers["x-forwarded-proto"] = "wss";
    proxy.ws(req, socket, head);
  });

  httpsServer.listen(443, () =>
    console.log(`[HTTPS] reverse proxy listening on :443 → ${target}`)
  );
}
