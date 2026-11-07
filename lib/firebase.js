import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* -------------------------------------------------------------------------- */
/*  FIREBASE CONFIGURATION                                                     */
/*  Everything is read from NEXT_PUBLIC_* variables so the same module works   */
/*  in the browser and during the static build. Initialization is lazy so an   */
/*  unconfigured project never crashes the storefront (local fallback).        */
/* -------------------------------------------------------------------------- */

const REQUIRED_KEYS = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

/** Values shipped in .env.local.example — never treat these as real. */
const PLACEHOLDER_PATTERNS = [
  /placeholder/i,
  /your-/i,
  /^replace_with/i,
  /^1:123456789012/i,
  /^abcdef/i,
  /^AIzaSyPlaceholder/i,
];

function readEnv(value) {
  return typeof value === "string" ? value.trim().replace(/^["']|["']$/g, "") : "";
}

export function getFirebaseConfig() {
  return {
    apiKey: readEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: readEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: readEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket: readEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: readEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    appId: readEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  };
}

function isPlaceholder(value) {
  if (!value) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * True only when a complete, non-placeholder web app config is present.
 * When false the storefront uses the bundled catalog and the auth drawer
 * shows a setup notice instead of attempting network calls.
 */
export function isFirebaseConfigured() {
  const config = getFirebaseConfig();
  return REQUIRED_KEYS.every((key) => !isPlaceholder(config[key]));
}

/** Human-readable reason used by the auth drawer / console diagnostics. */
export function getFirebaseConfigIssue() {
  const config = getFirebaseConfig();
  const missing = REQUIRED_KEYS.filter((key) => isPlaceholder(config[key]));

  if (missing.length === 0) return null;

  return `Firebase web app config incomplete: ${missing.join(", ")}`;
}

/* -------------------------------------------------------------------------- */
/*  LAZY SINGLETONS                                                            */
/* -------------------------------------------------------------------------- */

let appInstance = null;
let authInstance = null;
let dbInstance = null;

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error(getFirebaseConfigIssue() ?? "Firebase is not configured.");
  }

  if (!appInstance) {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
  }

  return appInstance;
}

export function getFirebaseAuth() {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }

  return authInstance;
}

export function getFirebaseDb() {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseApp());
  }

  return dbInstance;
}
