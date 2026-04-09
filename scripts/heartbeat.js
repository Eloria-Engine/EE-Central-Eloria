/**
 * heartbeat.js — EE-Central-Eloria
 * Reporta el estado del hub central al motor Eloria Engine.
 * Uso: node scripts/heartbeat.js  |  npm run heartbeat
 */
'use strict';

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');

function loadEnvFile() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

loadEnvFile();

const API_URL     = process.env.ELORIA_ENGINE_API_URL || process.env.ELORIA_API_URL || '';
const API_TOKEN   = process.env.ELORIA_API_TOKEN      || '';
const HMAC_SECRET = process.env.ELORIA_HMAC_SECRET    || '';

const PROJECT_ID     = 'EE-Central-Eloria';
const ELORIA_VERSION = (() => {
  try {
    const v = JSON.parse(fs.readFileSync(path.join(ROOT, 'eloria-version.json'), 'utf-8'));
    return v.engine_version || '2.5.0';
  } catch { return '2.5.0'; }
})();

function signPayload(payload, secret) {
  return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
}

function postJson(url, body, token) {
  return new Promise((resolve, reject) => {
    const parsed  = new URL(url);
    const lib     = parsed.protocol === 'https:' ? https : http;
    const strBody = JSON.stringify(body);
    const options = {
      hostname: parsed.hostname,
      port:     parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path:     parsed.pathname,
      method:   'POST',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(strBody), 'X-Eloria-Token': token },
    };
    const req = lib.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end',  ()    => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy(new Error('timeout')));
    req.write(strBody);
    req.end();
  });
}

function filesystemFallback() {
  const registryPath = path.join(ROOT, '..', '..', '..', 'memory', 'family-registry.json');
  if (!fs.existsSync(registryPath)) return false;
  try {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    const node = registry.nodes && registry.nodes.find(n => n.id === PROJECT_ID);
    if (!node) return false;
    node.last_heartbeat = new Date().toISOString();
    registry.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
    console.log('[heartbeat] ✓ Fallback filesystem: last_heartbeat actualizado');
    return true;
  } catch (err) {
    console.log(`[heartbeat] Fallback filesystem falló: ${err.message}`);
    return false;
  }
}

async function main() {
  const base = {
    project_id:     PROJECT_ID,
    eloria_version: ELORIA_VERSION,
    timestamp:      new Date().toISOString(),
    status:         'healthy',
    uptime_ms:      process.uptime() * 1000,
  };
  const payload = HMAC_SECRET ? { ...base, signature: signPayload(base, HMAC_SECRET) } : base;

  if (!API_URL) {
    console.log('[heartbeat] Sin URL — intentando fallback filesystem');
    filesystemFallback();
    process.exit(0);
  }

  const endpoint = `${API_URL.replace(/\/$/, '')}/heartbeat`;
  try {
    const res = await postJson(endpoint, payload, API_TOKEN);
    if (res.status >= 200 && res.status < 300) {
      console.log(`[heartbeat] ✓ OK (HTTP ${res.status})`);
    } else {
      console.warn(`[heartbeat] HTTP ${res.status} — fallback filesystem`);
      filesystemFallback();
    }
    process.exit(0);
  } catch (err) {
    console.warn(`[heartbeat] Error de red: ${err.message} — fallback filesystem`);
    filesystemFallback();
    process.exit(0);
  }
}

main();
