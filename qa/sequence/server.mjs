import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0}html,body{width:100%;height:100%;overflow:hidden;background:#091625}canvas{display:block;width:100%;height:100%}</style><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script></head><body><script type="module" src="/stage.mjs"></script></body></html>`;
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (url.pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/html" }).end(html);
        return;
      }
      let target;
      if (url.pathname === "/stage.mjs")
        target = path.join(root, "qa/sequence/stage.mjs");
      else if (url.pathname.startsWith("/three/"))
        target = path.join(root, "node_modules/three", url.pathname.slice(7));
      else throw Error("Not found");
      if (!target.startsWith(root + path.sep)) throw Error("Not found");
      res
        .writeHead(200, { "Content-Type": "application/javascript" })
        .end(await fs.readFile(target));
    } catch {
      res.writeHead(404).end();
    }
  })
  .listen(3022, "127.0.0.1", () =>
    console.log("Sequence studio http://127.0.0.1:3022"),
  );
