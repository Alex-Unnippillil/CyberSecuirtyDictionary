#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const http = require("http");

const redirectsPath = path.join(__dirname, "..", "redirects.json");
let redirects = {};
if (fs.existsSync(redirectsPath)) {
  redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));
}

const server = http.createServer((req, res) => {
  const url = req.url.replace(/\/$/, "");
  const target = redirects[url];
  if (target) {
    res.writeHead(301, { Location: target });
    return res.end();
  }
  res.statusCode = 404;
  res.end("Not found");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Static router running on http://localhost:${port}`);
});
