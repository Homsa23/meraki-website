"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    subtotal,
    totalCount,
  } = useCart();
  const reduceMotion = useReducedMotion() === true;
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence onExitComplete={() => setOffline(false)}>
      {isOpen && (
        <motion.div
          key="cart-drawer"
          className="fixed inset-0 z-[140]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close cart"
            onClick={closeCart}
            className="absolute inset-0 h-full w-full cursor-default bg-deep-ink/[0.04] backdrop-blur-[2px]"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white/85 px-7 pb-8 pt-6 shadow-[-32px_0_80px_rgba(8,9,12,0.08)] backdrop-blur-xl md:px-10 md:pb-10 md:pt-8"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-start justify-between border-b border-basalt/10 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-deep-ink/70">
                [ CART ({totalCount}) ]
              </span>

              <button
                type="button"
                aria-label="Close cart"
                autoFocus
                onClick={closeCart}
                className="-mr-1 px-1 py-1 text-[10px] uppercase tracking-[0.22em] text-deep-ink/70 transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="font-editorial text-[24px] uppercase tracking-[0.16em] text-deep-ink/80">
                    Empty
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.26em] text-basalt/50">
                    [ NO ITEMS IN ARCHIVE ]
                  </span>
                </div>
              ) : (
                <ul className="divide-y divide-basalt/10">
                  {items.map((item) => (
                    <li key={item.lineId} className="flex gap-4 py-5">
                      <div className="relative h-24 w-16 shrink-0 overflow-hidden bg-basalt/[0.04]">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center font-mono text-[9px] tracking-[0.2em] text-basalt/45">
                            MRK
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-basalt/55">
                              {item.code}
                            </p>
                            <h3 className="mt-1 truncate font-editorial text-[15px] leading-tight text-deep-ink">
                              {item.title}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.lineId)}
                            aria-label={`Remove ${item.title}`}
                            className="-mr-1 -mt-1 shrink-0 px-1 text-[15px] leading-none text-basalt/45 transition-colors duration-300 hover:text-crimson focus-visible:text-crimson focus-visible:outline-none"
                          >
                            ×
                          </button>
                        </div>

                        <div className="mt-4 flex items-baseline justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
                          <span className="text-basalt/60">
                            SZ: {item.size}
                            {item.quantity > 1 ? ` / QTY ${item.quantity}` : ""}
                          </span>
                          <span className="shrink-0 text-deep-ink">
                            {item.formattedPrice}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="shrink-0 border-t border-basalt/10 pt-5">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em]">
                <span className="text-basalt/60">Subtotal</span>
                <span className="text-deep-ink">
                  € {subtotal.toFixed(2)}{" "}
                  <span className="text-basalt/45">EUR</span>
                </span>
              </div>

              <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-basalt/45">
                Taxes &amp; shipping calculated at checkout
              </p>

              <button
                type="button"
                onClick={() => setOffline(true)}
                disabled={items.length === 0}
                aria-live="polite"
                className="mt-5 w-full bg-deep-ink py-4 text-center font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-white transition-colors duration-300 hover:bg-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson disabled:cursor-not-allowed disabled:opacity-30"
              >
                {offline ? "SYSTEM OFFLINE" : "PROCEED TO CHECKOUT"}
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
