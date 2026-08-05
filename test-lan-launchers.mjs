import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectDir = dirname(fileURLToPath(import.meta.url));
const startPath = join(projectDir, "start-lan-preview.ps1");
const stopPath = join(projectDir, "stop-lan-preview.ps1");

assert.ok(existsSync(startPath), "missing one-click LAN start script");
assert.ok(existsSync(stopPath), "missing LAN stop script");

const startScript = readFileSync(startPath, "utf8");
const stopScript = readFileSync(stopPath, "utf8");

assert.match(startScript, /lan_server\.py/);
assert.match(startScript, /0\.0\.0\.0/);
assert.match(startScript, /\/health/);
assert.match(startScript, /\.lan-preview-/);
assert.match(stopScript, /lan_server\.py/);
assert.match(stopScript, /\.lan-preview-/);
assert.doesNotMatch(startScript, /[^\x00-\x7F]/, "Windows PowerShell 5.1 launcher must be ASCII-safe");
assert.doesNotMatch(stopScript, /[^\x00-\x7F]/, "Windows PowerShell 5.1 launcher must be ASCII-safe");

console.log("LAN launcher checks passed");
