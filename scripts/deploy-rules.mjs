#!/usr/bin/env node
/**
 * Deploy firestore.rules through the Firebase Rules API.
 * Useful when the Firebase CLI account lacks project access but the
 * service account has Firebase Rules Admin.
 *
 * Usage:
 *   npm run deploy:rules
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert } from "firebase-admin/app";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "meraki-92e3f";
const RULES_PATH = resolve(process.cwd(), "firestore.rules");
const API_BASE = "https://firebaserules.googleapis.com/v1";
const RELEASE_NAME = `projects/${PROJECT_ID}/releases/cloud.firestore`;

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

async function getAccessToken() {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!keyPath) {
    fail("FIREBASE_SERVICE_ACCOUNT_KEY is not set.");
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(readFileSync(resolve(keyPath), "utf8"));
  } catch (error) {
    fail(`Could not read service account key: ${error.message}`);
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

async function main() {
  const token = await getAccessToken();
  const content = readFileSync(RULES_PATH, "utf8");

  console.log(`\nDeploying Firestore rules`);
  console.log(`Project: ${PROJECT_ID}\n`);

  const ruleset = await api(token, `/projects/${PROJECT_ID}/rulesets`, {
    method: "POST",
    body: JSON.stringify({
      source: {
        files: [{ name: "firestore.rules", content }],
      },
    }),
  });

  console.log(`Created ruleset: ${ruleset.name}`);

  try {
    await api(token, `/projects/${PROJECT_ID}/releases/cloud.firestore`, {
      method: "PATCH",
      body: JSON.stringify({
        release: { name: RELEASE_NAME, rulesetName: ruleset.name },
        updateMask: "rulesetName",
      }),
    });
  } catch (error) {
    if (!String(error.message).startsWith("404")) throw error;

    await api(token, `/projects/${PROJECT_ID}/releases`, {
      method: "POST",
      body: JSON.stringify({
        name: RELEASE_NAME,
        rulesetName: ruleset.name,
      }),
    });
  }

  console.log(`✓ Released to ${RELEASE_NAME}\n`);
}

main().catch((error) => fail(error.message));
