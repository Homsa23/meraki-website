"use client";

import { createContext, useContext, useState } from "react";

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

export function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (product, size) => {
    if (!product) return;

    const lineId = `${product.id}:${size}`;
    const unitPrice = parsePrice(product.price);

    setItems((prev) => {
      const existing = prev.find((item) => item.lineId === lineId);

      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
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
    });
  };

  const removeItem = (lineId) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const clearCart = () => setItems([]);

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
