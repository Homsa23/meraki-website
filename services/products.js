import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { MEN, WOMEN } from "@/lib/collection";

/* -------------------------------------------------------------------------- */
/*  PRODUCT SERVICE                                                            */
/*  Firestore is the source of truth. The bundled catalog is only used as a    */
/*  resilient fallback while the project is unconfigured, empty or offline.    */
/* -------------------------------------------------------------------------- */

const PRODUCTS_COLLECTION = "products";
const FALLBACK_IMAGE = { width: 1000, height: 1000 };
const FIRESTORE_TIMEOUT_MS = 7000;

function withTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firestore request timed out."));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function normalizeCollection(value) {
  const normalized = String(value ?? "").trim().toUpperCase();
  return normalized === "WOMEN" ? "WOMEN" : normalized === "MEN" ? "MEN" : null;
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];

  return images
    .map((image) => {
      if (typeof image === "string") {
        return { src: image, ...FALLBACK_IMAGE };
      }

      if (!image || typeof image !== "object" || !image.src) return null;

      const width = Number(image.width);
      const height = Number(image.height);

      return {
        src: String(image.src),
        width: Number.isFinite(width) && width > 0 ? width : FALLBACK_IMAGE.width,
        height:
          Number.isFinite(height) && height > 0 ? height : FALLBACK_IMAGE.height,
      };
    })
    .filter(Boolean);
}

/** Convert a Firestore document into the Product shape used by the UI. */
export function normalizeProduct(id, data = {}) {
  const images = normalizeImages(data.images);
  const fallbackImages =
    images.length > 0
      ? images
      : normalizeImages([
          data.image,
          data.imageUrl,
          data.thumbnail,
        ]);

  return {
    id,
    name: String(data.name ?? "Untitled"),
    meta: String(data.meta ?? data.subtitle ?? ""),
    price:
      typeof data.price === "number"
        ? `€ ${data.price}`
        : String(data.price ?? ""),
    code: data.code ? String(data.code) : undefined,
    collection:
      normalizeCollection(data.collection) ??
      normalizeCollection(data.gender) ??
      "MEN",
    images: fallbackImages,
    order: Number.isFinite(Number(data.order)) ? Number(data.order) : null,
  };
}

function compareProducts(a, b) {
  if (a.order !== null && b.order !== null && a.order !== b.order) {
    return a.order - b.order;
  }
  if (a.order !== null && b.order === null) return -1;
  if (a.order === null && b.order !== null) return 1;
  return a.name.localeCompare(b.name);
}

function stripOrder(product) {
  const { order, ...rest } = product;
  return rest;
}

/** Bundled catalog used when Firestore is unavailable or not seeded yet. */
export function getLocalProducts(collectionName) {
  const normalized = normalizeCollection(collectionName);

  if (normalized === "MEN") return MEN;
  if (normalized === "WOMEN") return WOMEN;
  return [...MEN, ...WOMEN];
}

/**
 * Load products with diagnostics.
 *
 * @returns {Promise<{
 *   products: import("@/lib/collection").Product[],
 *   source: "firestore" | "local",
 *   reason: "unconfigured" | "empty" | "error" | null,
 *   error: unknown,
 * }>}
 */
export async function loadProducts({ collection: collectionName } = {}) {
  const normalized = normalizeCollection(collectionName);

  if (!isFirebaseConfigured()) {
    return {
      products: getLocalProducts(normalized),
      source: "local",
      reason: "unconfigured",
      error: null,
    };
  }

  try {
    const db = getFirebaseDb();
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const request = normalized
      ? getDocs(query(productsRef, where("collection", "==", normalized)))
      : getDocs(productsRef);
    const snapshot = await withTimeout(request, FIRESTORE_TIMEOUT_MS);

    const products = snapshot.docs
      .map((productDoc) => normalizeProduct(productDoc.id, productDoc.data()))
      .filter((product) => product.images.length > 0)
      .sort(compareProducts)
      .map(stripOrder);

    if (products.length === 0) {
      // The collection exists but has not been seeded yet — keep the storefront
      // usable while making the state visible to the caller.
      return {
        products: getLocalProducts(normalized),
        source: "local",
        reason: "empty",
        error: null,
      };
    }

    return { products, source: "firestore", reason: null, error: null };
  } catch (error) {
    return {
      products: getLocalProducts(normalized),
      source: "local",
      reason: "error",
      error,
    };
  }
}

/** Convenience wrapper returning just the product array. */
export async function getProducts(options) {
  const { products } = await loadProducts(options);
  return products;
}

/** Fetch a single product from Firestore, falling back to the bundled catalog. */
export async function getProductById(id) {
  if (!id) return null;

  if (isFirebaseConfigured()) {
    try {
      const snapshot = await withTimeout(
        getDoc(doc(getFirebaseDb(), PRODUCTS_COLLECTION, id)),
        FIRESTORE_TIMEOUT_MS
      );

      if (snapshot.exists()) {
        const product = normalizeProduct(snapshot.id, snapshot.data());
        if (product.images.length > 0) return stripOrder(product);
      }
    } catch {
      // Fall through to the local catalog.
    }
  }

  return getLocalProducts().find((product) => product.id === id) ?? null;
}
