#!/usr/bin/env node
/**
 * Seed Firestore with the bundled Meraki catalog.
 *
 * Usage:
 *   npm run seed:products -- --dry-run   # preview, no writes
 *   npm run seed:products                # write to Firestore
 *
 * Credentials (one of):
 *   FIREBASE_SERVICE_ACCOUNT_KEY=/absolute/path/service-account.json
 *   GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/service-account.json
 *   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'   (inline JSON)
 *
 * The service account must belong to the meraki-92e3f project and have the
 * "Cloud Datastore User" / "Firebase Admin" role.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { MEN, WOMEN } from "../lib/collection.ts";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "meraki-92e3f";
const DRY_RUN = process.argv.includes("--dry-run");
const PRODUCTS_COLLECTION = "products";

function resolveCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    } catch (error) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT is not valid JSON: ${error.message}`
      );
    }
  }

  const keyPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (keyPath) {
    const absolutePath = resolve(keyPath);

    try {
      return cert(JSON.parse(readFileSync(absolutePath, "utf8")));
    } catch (error) {
      throw new Error(
        `Could not read service account key at ${absolutePath}: ${error.message}`
      );
    }
  }

  return applicationDefault();
}

function toFirestoreData(product, order) {
  const data = {
    name: product.name,
    meta: product.meta,
    price: product.price,
    collection: product.collection,
    images: product.images,
    order,
    seededAt: new Date(),
  };

  if (product.code) data.code = product.code;

  return data;
}

function buildCatalog() {
  return [
    ...MEN.map((product, order) => ({ product, order })),
    ...WOMEN.map((product, order) => ({ product, order })),
  ];
}

async function main() {
  const catalog = buildCatalog();

  console.log(`\nMeraki catalog migration`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Collection: ${PRODUCTS_COLLECTION}`);
  console.log(`Documents: ${catalog.length}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no writes)" : "WRITE"}\n`);

  for (const { product, order } of catalog) {
    console.log(
      `  ${product.collection.padEnd(5)}  ${String(order).padStart(2, "0")}  ${product.id.padEnd(22)}  ${product.name}`
    );
  }

  if (DRY_RUN) {
    console.log(`\nDry run complete. Re-run without --dry-run to write.\n`);
    return;
  }

  let app;
  try {
    app = initializeApp({ credential: resolveCredential(), projectId: PROJECT_ID });
  } catch (error) {
    throw new Error(
      `Could not initialize Firebase Admin. Provide a service account key via FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS.\n${error.message}`
    );
  }

  const db = getFirestore(app);
  const batch = db.batch();

  for (const { product, order } of catalog) {
    const ref = db.collection(PRODUCTS_COLLECTION).doc(product.id);
    batch.set(ref, toFirestoreData(product, order), { merge: true });
  }

  await batch.commit();

  const menCount = MEN.length;
  const womenCount = WOMEN.length;

  console.log(
    `\n✓ Seeded ${catalog.length} products into ${PROJECT_ID}/${PRODUCTS_COLLECTION}`
  );
  console.log(`  MEN ${menCount} · WOMEN ${womenCount}`);
  console.log(`\nNext: deploy the security rules with`);
  console.log(`  npx -y firebase-tools@latest deploy --only firestore:rules --project ${PROJECT_ID}\n`);
}

main().catch((error) => {
  console.error(`\n✖ Migration failed\n${error.message}\n`);
  process.exitCode = 1;
});
