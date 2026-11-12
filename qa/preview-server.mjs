import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
const root = path.resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      let file = path.resolve(root, "." + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      if ((await fs.stat(file)).isDirectory())
        file = path.join(file, "index.html");
      let body = await fs.readFile(file);
      const ext = path.extname(file);
      const headers = {
        "Content-Type": types[ext] || "application/octet-stream",
        "Cache-Control": [".html", ".txt"].includes(ext)
          ? "no-cache"
          : "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        Vary: "Accept-Encoding",
      };
      if (
        /gzip/.test(req.headers["accept-encoding"] || "") &&
        [".html", ".js", ".css", ".json", ".txt", ".xml", ".svg"].includes(ext)
      ) {
        body = gzipSync(body);
        headers["Content-Encoding"] = "gzip";
      }
      headers["Content-Length"] = body.length;
      res.writeHead(200, headers).end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
    }
  })
  .listen(3019, "127.0.0.1", () =>
    console.log("Production-style local preview: http://127.0.0.1:3019"),
  );
