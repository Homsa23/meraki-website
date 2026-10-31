"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal } = useCart();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200"
      />

      {/* Side Drawer Panel */}
      <aside
        aria-label="Shopping Cart Drawer"
        className="relative z-10 w-full max-w-md sm:max-w-lg bg-meraki-cream border-l border-meraki-stone shadow-none rounded-none flex flex-col justify-between h-full animate-in slide-in-from-right duration-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-meraki-stone">
          <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-meraki-black">
            [ SHOPPING CART ]
          </span>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-meraki-black hover:bg-meraki-black hover:text-meraki-cream px-2 py-1 transition-colors duration-150 rounded-none focus:outline-none"
          >
            X
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 font-mono text-xs uppercase tracking-widest text-meraki-stone text-center border-b border-meraki-stone">
              [ CART IS CURRENTLY EMPTY ]
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-6 border-b border-meraki-stone flex gap-5 items-start"
              >
                {/* Square Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-meraki-cream border border-meraki-stone shrink-0 overflow-hidden">
                  <Image
                    src={item.image || "/images/asymmetrical-denim-jacket.jpg"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-meraki-black truncate">
                    {item.title}
                  </h3>
                  <div className="font-mono text-xs text-meraki-stone tracking-widest mt-1">
                    {item.size || "SZ: L"}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-meraki-black mt-3">
                    {item.formattedPrice || `$${Number(item.price).toFixed(2)}`}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Subtotal & Taxes Info */}
          <div className="p-6 border-b border-meraki-stone">
            <div className="flex justify-between items-center font-mono text-xs sm:text-sm uppercase tracking-widest text-meraki-black">
              <span>SUBTOTAL</span>
              <span className="font-bold">${subtotal.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-meraki-stone font-mono text-[10px] sm:text-xs text-meraki-stone uppercase tracking-wider">
            [ TAXES &amp; SHIPPING CALCULATED AT FINAL CHECKOUT ]
          </div>
        </div>

        {/* Absolute Bottom: Full-Width PROCEED TO CHECKOUT Button */}
        <div className="w-full shrink-0">
          <button
            type="button"
            className="w-full block text-center py-5 sm:py-6 bg-meraki-black text-meraki-cream font-mono font-bold text-xs sm:text-sm tracking-[0.25em] uppercase rounded-none border-t border-meraki-black transition-colors duration-150 hover:bg-meraki-cream hover:text-meraki-black focus:outline-none cursor-pointer"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </aside>
    </div>
  );
}
