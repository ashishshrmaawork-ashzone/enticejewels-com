const fs = require("node:fs");
const path = require("node:path");
const { loadEnvConfig } = require("@next/env");

const root = path.resolve(__dirname, "..");
loadEnvConfig(root);
const config = require("../next.config.js");
const basePath = (config.basePath ?? config.env?.NEXT_PUBLIC_BASE_PATH ?? process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const output = path.join(root, "out");
if (!fs.existsSync(path.join(output, "live", "index.html"))) {
  throw new Error("The live route shell is missing. Run a successful Next.js export first.");
}
// Include Apache routing and point its 404 document at the configured mount.
const rules = fs.readFileSync(path.join(root, "public", ".htaccess"), "utf8")
  .replace("ErrorDocument 404 /404.html", `ErrorDocument 404 ${basePath}/404.html`);
const target = path.join(output, ".htaccess");
// Windows marks .htaccess hidden; opening an existing hidden file with "w"
// fails with EPERM. Update it in place without changing its attributes.
const descriptor = fs.openSync(target, fs.existsSync(target) ? "r+" : "w");
try {
  fs.writeFileSync(descriptor, rules);
  fs.ftruncateSync(descriptor, Buffer.byteLength(rules));
} finally {
  fs.closeSync(descriptor);
}
console.log("Prepared out/.htaccess with live CMS routing.");
