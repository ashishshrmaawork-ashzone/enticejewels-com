const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const { spawn, execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const apache = process.env.APACHE_BINARY || "D:/xampp/apache/bin/httpd.exe";

test("Apache serves exported pages and new CMS routes while keeping missing assets as 404", {
  skip: process.platform !== "win32" || !fs.existsSync(apache) || !fs.existsSync(path.join(root, "out/live/index.html")),
  timeout: 20000,
}, async t => {
  const socket = net.createServer();
  await new Promise(resolve => socket.listen(0, "127.0.0.1", resolve));
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "entice-static-test-"));
  const slash = value => value.replaceAll("\\", "/");
  const apacheRoot = slash(path.resolve(path.dirname(apache), ".."));
  const out = slash(path.join(root, "out"));
  const temp = slash(directory);
  const config = `ServerRoot "${apacheRoot}"
Listen 127.0.0.1:${port}
ServerName 127.0.0.1
PidFile "${temp}/httpd.pid"
ErrorLog "${temp}/error.log"
LoadModule authz_core_module modules/mod_authz_core.so
LoadModule alias_module modules/mod_alias.so
LoadModule dir_module modules/mod_dir.so
LoadModule mime_module modules/mod_mime.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
LoadModule expires_module modules/mod_expires.so
TypesConfig "${apacheRoot}/conf/mime.types"
DocumentRoot "${out}"
Alias /enticejewels.com/ "${out}/"
<Directory "${out}">
  Require all granted
  AllowOverride All
  Options FollowSymLinks
  DirectoryIndex index.html
</Directory>
`;
  const filename = path.join(directory, "httpd.conf");
  fs.writeFileSync(filename, config);
  const server = spawn(apache, ["-f", filename], { windowsHide: true, stdio: "ignore" });
  let spawnError;
  server.on("error", error => { spawnError = error; });
  t.after(() => {
    if (server.pid) {
      try { execFileSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" }); } catch { /* Already stopped. */ }
    }
    // Delete only this test's generated directory under the OS temp root.
    if (path.dirname(directory) === os.tmpdir() && path.basename(directory).startsWith("entice-static-test-")) fs.rmSync(directory, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    if (spawnError) throw spawnError;
    try { await fetch(base, { signal: AbortSignal.timeout(500) }); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  assert(ready, fs.existsSync(path.join(directory, "error.log")) ? fs.readFileSync(path.join(directory, "error.log"), "utf8") : "Apache did not start");
  const shell = fs.readFileSync(path.join(root, "out/live/index.html"), "utf8");
  for (const prefix of ["", "/enticejewels.com"]) {
    for (const suffix of ["/blog/newly-published-test/", "/news/newly-published-test/", "/csr/newly-published-test/", "/collections/newly-published-test/", "/collections/entice-fashion/new-category/", "/collections/entice-fashion/necklace/new-product/"]) {
      const response = await fetch(base + prefix + suffix);
      assert.equal(response.status, 200, prefix + suffix);
      assert.equal(await response.text(), shell, prefix + suffix);
      assert.match(response.headers.get("cache-control"), /no-cache/);
    }
    const about = await fetch(base + prefix + "/about-us/");
    assert.equal(about.status, 200);
    assert.equal(await about.text(), fs.readFileSync(path.join(root, "out/about-us/index.html"), "utf8"));
    assert.equal((await fetch(base + prefix + "/_next/missing-test.js")).status, 404);
  }
});
