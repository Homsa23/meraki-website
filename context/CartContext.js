"use client";

import { createContext, useContext, useState } from "react";

const initialCartItem = {
  id: "adj-001",
  title: "ASYMMETRICAL DENIM JACKET",
  size: "SZ: L",
  price: 480.0,
  formattedPrice: "$480.00",
  image: "/images/asymmetrical-denim-jacket.jpg",
  quantity: 1,
};

const CartContext = createContext({
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  totalCount: 0,
  subtotal: 0,
});

export function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([initialCartItem]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
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
