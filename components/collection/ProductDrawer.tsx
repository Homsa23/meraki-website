"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/collection";

const SIZES = ["S", "M", "L", "XL"] as const;
type Size = (typeof SIZES)[number];

type ProductDrawerProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductDrawer({ product, onClose }: ProductDrawerProps) {
  const reduceMotion = useReducedMotion() === true;
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [added, setAdded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const images = product?.images ?? [];
  const totalImages = images.length;
  const activeImage = images[currentImg] ?? images[0];

  const nextImage = () => {
    if (totalImages < 2) return;

    setCurrentImg((index) => (index + 1) % totalImages);
  };

  const prevImage = () => {
    if (totalImages < 2) return;

    setCurrentImg((index) => (index - 1 + totalImages) % totalImages);
  };

  // Close on Escape & trap body scroll
  useEffect(() => {
    if (!product) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [product, onClose]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      {product && activeImage && (
        <div className="fixed inset-0 z-[130] flex justify-end">
          {/* Subtle frosted scrim backdrop */}
          <motion.div
            key="scrim"
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 cursor-default bg-deep-ink/[0.08] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Frosted Glass Slide-Out Panel */}
          <motion.aside
            key="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} purchase details`}
            className="relative z-10 flex h-full w-full max-w-[440px] flex-col justify-between overflow-y-auto bg-white/85 px-6 pb-8 pt-6 shadow-[-28px_0_70px_rgba(8,9,12,0.08)] backdrop-blur-xl sm:px-8 sm:pb-10 sm:pt-8"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Header: Reference Code & Minimal Close */}
            <div className="flex items-center justify-between border-b border-basalt/10 pb-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-basalt/60">
                REF: {product.code || "MRK-01"}
              </span>

              <button
                type="button"
                autoFocus
                onClick={onClose}
                aria-label="Close product drawer"
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-deep-ink/70 transition-opacity hover:opacity-40 focus-visible:outline-none"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Main Content: Large Portrait Photo & Details */}
            <div className="my-auto flex flex-col py-6">
              {/* Large Product Portrait — click to cycle views */}
              <button
                type="button"
                onClick={nextImage}
                aria-label={
                  totalImages > 1
                    ? `Show next view (${currentImg + 1} of ${totalImages})`
                    : `${product.name} view`
                }
                className="group relative flex aspect-[3/4] max-h-[380px] w-full cursor-pointer items-center justify-center overflow-hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={`${product.id}-${currentImg}`}
                    src={activeImage.src}
                    alt={`${product.name} — view ${currentImg + 1}`}
                    draggable={false}
                    initial={reduceMotion ? false : { x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { x: -20, opacity: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.34,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain p-4"
                  />
                </AnimatePresence>
              </button>

              {/* Minimal view controls */}
              <div className="mt-2 flex items-center gap-5">
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous view"
                  disabled={totalImages < 2}
                  className="cursor-pointer text-gray-400 transition-colors duration-300 hover:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft
                    aria-hidden="true"
                    strokeWidth={1}
                    className="h-4 w-4"
                  />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next view"
                  disabled={totalImages < 2}
                  className="cursor-pointer text-gray-400 transition-colors duration-300 hover:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronRight
                    aria-hidden="true"
                    strokeWidth={1}
                    className="h-4 w-4"
                  />
                </button>
              </div>

              {/* Title & Price */}
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h2 className="font-editorial text-[22px] font-normal tracking-wide text-deep-ink sm:text-[26px]">
                  {product.name}
                </h2>
                <span className="shrink-0 font-mono text-[14px] font-medium tracking-wide text-deep-ink">
                  {product.price}
                </span>
              </div>

              {/* Meta / Spec */}
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-basalt/55">
                {product.meta}
              </p>

              {/* Minimalist Size Selector */}
              <div className="mt-8 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-basalt/60">
                    SIZE
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-deep-ink/80">
                    SELECTED: {selectedSize}
                  </span>
                </div>

                <div className="flex items-center gap-7 pt-1">
                  {SIZES.map((size) => {
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={isActive}
                        className={`relative pb-1.5 font-mono text-[13px] tracking-wider transition-colors cursor-pointer ${
                          isActive
                            ? "font-bold text-deep-ink"
                            : "text-basalt/40 hover:text-deep-ink"
                        }`}
                      >
                        {size}
                        {isActive && (
                          <motion.span
                            layoutId="activeSizeUnderline"
                            aria-hidden="true"
                            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-deep-ink"
                            transition={{
                              duration: 0.25,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom: Stark Full-Width "ADD TO CART" Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added}
                className="w-full bg-deep-ink py-4 text-center font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-white transition-all duration-300 hover:bg-crimson active:scale-[0.99] cursor-pointer"
              >
                {added ? "ADDED TO ARCHIVE ✓" : "ADD TO CART"}
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
