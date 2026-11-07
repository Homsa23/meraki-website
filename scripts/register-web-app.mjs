#!/usr/bin/env node
/**
 * Register (or reuse) the Meraki web app and write its config to .env.local.
 *
 * Usage:
 *   npm run register:web-app
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY in .env.local (or the environment).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert } from "firebase-admin/app";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "meraki-92e3f";
const DISPLAY_NAME = process.env.FIREBASE_WEB_APP_NAME || "meraki-web";
const ENV_PATH = resolve(process.cwd(), ".env.local");
const API_BASE = "https://firebase.googleapis.com/v1beta1";
const ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

async function getAccessToken() {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!keyPath) {
    fail(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not set. Add it to .env.local first."
    );
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(readFileSync(resolve(keyPath), "utf8"));
  } catch (error) {
    fail(`Could not read service account key at ${keyPath}: ${error.message}`);
  }

  const credential = cert(serviceAccount);
  const { access_token: token } = await credential.getAccessToken();
  return token;
}

async function api(token, path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = data?.error?.message || response.statusText;
    throw new Error(`${response.status} ${message}`);
  }

  return data;
}

async function waitForOperation(token, operation) {
  let current = operation;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (current.done) {
      if (current.error) {
        throw new Error(current.error.message || "Operation failed.");
      }
      return current.response;
    }

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 1000));
    current = await api(token, `/${current.name}`);
  }

  throw new Error("Timed out waiting for the web app operation.");
}

async function findWebApp(token) {
  const data = await api(token, `/projects/${PROJECT_ID}/webApps`);
  const apps = data.apps ?? [];
  return apps.find((app) => app.displayName === DISPLAY_NAME) ?? apps[0] ?? null;
}

async function createWebApp(token) {
  const operation = await api(token, `/projects/${PROJECT_ID}/webApps`, {
    method: "POST",
    body: JSON.stringify({ displayName: DISPLAY_NAME }),
  });

  return waitForOperation(token, operation);
}

function upsertEnv(text, key, value) {
  const line = `${key}="${value}"`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(text)) {
    return text.replace(pattern, line);
  }

  const suffix = text.endsWith("\n") ? "" : "\n";
  return `${text}${suffix}${line}\n`;
}

async function main() {
  const token = await getAccessToken();

  console.log(`\nMeraki web app registration`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`App name: ${DISPLAY_NAME}\n`);

  let app = await findWebApp(token);

  if (app) {
    console.log(`Using existing app: ${app.appId ?? app.name}`);
  } else {
    console.log("No web app found — creating one...");
    app = await createWebApp(token);
    console.log(`Created app: ${app.appId ?? app.name}`);
  }

  const appId = app.appId ?? String(app.name).split("/").pop();
  const config = await api(
    token,
    `/projects/${PROJECT_ID}/webApps/${encodeURIComponent(appId)}/config`
  );

  const values = {
    NEXT_PUBLIC_FIREBASE_API_KEY: config.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: config.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: config.projectId,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: config.storageBucket,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: config.messagingSenderId,
    NEXT_PUBLIC_FIREBASE_APP_ID: config.appId,
  };

  const missing = ENV_KEYS.filter((key) => !values[key]);

  if (missing.length > 0) {
    fail(`The web app config is missing: ${missing.join(", ")}`);
  }

  let envText = readFileSync(ENV_PATH, "utf8");

  for (const key of ENV_KEYS) {
    envText = upsertEnv(envText, key, values[key]);
  }

  writeFileSync(ENV_PATH, envText, "utf8");

  console.log(`\n✓ Web app config written to .env.local`);
  console.log(`  appId: ${values.NEXT_PUBLIC_FIREBASE_APP_ID}`);
  console.log(`  authDomain: ${values.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);
  console.log(`  storageBucket: ${values.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`);
  console.log(`\nRestart the build to pick up the new NEXT_PUBLIC_* values.\n`);
}

main().catch((error) => fail(error.message));
