"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

const CART_STORAGE_KEY = "meraki:cart";
const CART_CHANGE_EVENT = "meraki:cart-change";

/** Sentinel used during SSR/hydration so an empty cart is distinguishable. */
const CART_SERVER_SNAPSHOT = "__meraki_cart_server__";

/** In-memory fallback for browsers where localStorage is unavailable. */
let memoryCart = null;

const CartContext = createContext({
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  items: [],
  addItem: (_product, _size) => {},
  removeItem: (_lineId) => {},
  clearCart: () => {},
  totalCount: 0,
  subtotal: 0,
});

function parsePrice(price) {
  const value = Number.parseFloat(
    String(price ?? "").replace(/[^0-9.,]/g, "").replace(",", ".")
  );

  return Number.isFinite(value) ? value : 0;
}

function isStoredItem(item) {
  return (
    item &&
    typeof item === "object" &&
    typeof item.lineId === "string" &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}

/** Parse a raw localStorage payload, tolerating corrupt or blocked storage. */
function parseStoredCart(raw) {
  if (!raw || raw === CART_SERVER_SNAPSHOT) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isStoredItem) : [];
  } catch {
    return [];
  }
}

function getCartSnapshot() {
  if (typeof window === "undefined") return CART_SERVER_SNAPSHOT;

  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]";
  } catch {
    return memoryCart ?? "[]";
  }
}

function getServerCartSnapshot() {
  return CART_SERVER_SNAPSHOT;
}

/** Subscribe to cart changes from this tab and from other tabs. */
function subscribeToCart(onChange) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onChange);
  window.addEventListener(CART_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CART_CHANGE_EVENT, onChange);
  };
}

function writeCart(items) {
  const raw = JSON.stringify(items);
  memoryCart = raw;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, raw);
  } catch {
    // Storage can be unavailable (private mode / quota); the in-memory
    // fallback above still keeps the cart usable for this session.
  }

  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

export function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const rawCart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot
  );
  const items = useMemo(() => parseStoredCart(rawCart), [rawCart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (product, size) => {
    if (!product) return;

    const lineId = `${product.id}:${size}`;
    const unitPrice = parsePrice(product.price);
    const current = parseStoredCart(getCartSnapshot());
    const existing = current.find((item) => item.lineId === lineId);

    const next = existing
      ? current.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [
          ...current,
          {
            lineId,
            productId: product.id,
            code: product.code || "MRK-01",
            title: product.name,
            size,
            price: unitPrice,
            formattedPrice: product.price,
            image: product.images?.[0]?.src || "",
            quantity: 1,
          },
        ];

    writeCart(next);
  };

  const removeItem = (lineId) => {
    writeCart(
      parseStoredCart(getCartSnapshot()).filter(
        (item) => item.lineId !== lineId
      )
    );
  };

  const clearCart = () => writeCart([]);

  const totalCount = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        items,
        addItem,
        removeItem,
        clearCart,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
