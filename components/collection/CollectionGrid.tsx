"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  writeStoredOutfit,
  type Gender,
  type Product,
} from "@/lib/collection";
import { loadProducts } from "@/services/products";
import ProductDrawer from "./ProductDrawer";

type CollectionGridProps = {
  gender: Gender;
  index: string;
};

export default function CollectionGrid({ gender, index }: CollectionGridProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion() === true;
  const { totalCount, openCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"firestore" | "local" | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeMode, setActiveMode] = useState<"shop" | "style">("shop");
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadProducts({ collection: gender }).then((result) => {
      if (cancelled) return;

      setProducts(result.products);
      setSource(result.source);
      setReason(result.reason);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [gender]);

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const styleOutfit = () => {
    if (selected.length === 0) return;

    writeStoredOutfit({ collection: gender, ids: selected });
    router.push("/canvas");
  };

  const clearSelection = () => {
    setSelected([]);
  };

  const count = String(selected.length).padStart(2, "0");

  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col bg-white text-deep-ink"
      style={{ backgroundColor: "#FFFFFF", color: "#08090C" }}
    >
      <style>{`html, body { background: #FFFFFF !important; }`}</style>

      <header className="flex w-full items-center justify-between px-5 pb-4 pt-5 md:px-10 md:pb-5 md:pt-6">
        <Link
          href="/"
          className="font-editorial text-[15px] tracking-[0.08em] text-deep-ink/80 transition-colors duration-500 hover:text-crimson focus-visible:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        >
          Meraki
        </Link>

        <div className="flex items-center gap-5">
          <span className="text-[9px] uppercase tracking-[0.22em] text-basalt/55">
            {gender} / {index}
          </span>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${totalCount} ${
              totalCount === 1 ? "item" : "items"
            }`}
            className="text-[9px] uppercase tracking-[0.22em] text-deep-ink/70 transition-colors duration-500 hover:text-crimson focus-visible:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
          >
            [ CART ({totalCount}) ]
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1600px] px-5 pt-6 md:px-10 md:pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.32em] text-basalt/55">
              Collection {index} — Archive 2026
              {!loading && source && (
                <span
                  title={
                    reason === "error"
                      ? "Firestore unavailable — showing the bundled catalog"
                      : reason === "empty"
                        ? "Firestore collection is empty — showing the bundled catalog"
                        : reason === "unconfigured"
                          ? "Firebase web config missing — showing the bundled catalog"
                          : "Live Firestore catalog"
                  }
                  className="ml-2 text-basalt/35"
                >
                  {source === "firestore" ? "· LIVE" : "· LOCAL"}
                </span>
              )}
            </p>

            <h1 className="mt-3 font-editorial text-[13vw] font-normal leading-[0.82] tracking-[-0.03em] text-deep-ink/90 md:text-[5.5vw]">
              {gender}
            </h1>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            {/* The Mode Switch */}
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
              <span className="text-basalt/50">MODE:</span>
              <button
                type="button"
                onClick={() => setActiveMode("shop")}
                className={`transition-colors cursor-pointer ${
                  activeMode === "shop"
                    ? "font-bold text-deep-ink underline underline-offset-4"
                    : "text-basalt/40 hover:text-deep-ink"
                }`}
              >
                [ SHOP ]
              </button>
              <span className="text-basalt/30">/</span>
              <button
                type="button"
                onClick={() => setActiveMode("style")}
                className={`transition-colors cursor-pointer ${
                  activeMode === "style"
                    ? "font-bold text-deep-ink underline underline-offset-4"
                    : "text-basalt/40 hover:text-deep-ink"
                }`}
              >
                [ STYLE ]
              </button>
            </div>

            <p className="text-[8px] uppercase tracking-[0.28em] text-basalt/45">
              {activeMode === "style"
                ? `Click image to style (${selected.length} chosen)`
                : "Click piece to inspect & buy"}
            </p>
          </div>
        </div>
      </section>

      {/* Structured collection grid — Yeezy-style ultra-minimalist, borderless, centered. */}
      <section
        aria-label={`${gender} collection — select pieces`}
        className="mx-auto w-full max-w-[1600px] flex-1 px-5 pb-36 pt-8 md:px-10 md:pb-40 md:pt-12"
      >
        {loading ? (
          <motion.div
            key="collection-loading"
            role="status"
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[46svh] flex-col items-center justify-center gap-5"
          >
            <motion.span
              aria-hidden="true"
              className="pl-[0.3em] font-editorial text-[30px] lowercase leading-none tracking-[0.3em] text-deep-ink md:text-[38px]"
              animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
              }
            >
              meraki
            </motion.span>

            <span className="pl-[0.32em] text-[8px] uppercase tracking-[0.32em] text-basalt/55">
              LOADING ARCHIVE...
            </span>
          </motion.div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[40svh] items-center justify-center">
            <p className="text-[9px] uppercase tracking-[0.32em] text-basalt/55">
              ARCHIVE EMPTY
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-12 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14 xl:grid-cols-6">
          {products.map((product, i) => {
            const isSelected = selected.includes(product.id);

            return (
              <div
                key={product.id}
                className={`group relative flex flex-col items-center justify-center p-2 text-center transition-all duration-300 ${
                  isSelected && activeMode === "style"
                    ? "opacity-50"
                    : "opacity-100"
                }`}
              >
                {/* Clicking image toggles style in style mode, opens drawer in shop mode */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeMode === "style") {
                      toggle(product.id);
                    } else {
                      setDrawerProduct(product);
                    }
                  }}
                  aria-label={
                    activeMode === "style"
                      ? `${isSelected ? "Deselect" : "Select"} ${product.name} for styling`
                      : `View ${product.name}`
                  }
                  className="relative aspect-[4/5] w-full flex items-center justify-center overflow-hidden cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
                >
                  <Image
                    src={product.images[0].src}
                    alt={`${product.name} — ${product.meta}`}
                    fill
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 20vw, 16vw"
                    priority={i < 4}
                    draggable={false}
                    className="pointer-events-none object-contain p-2 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] md:p-3"
                  />
                </button>

                {/* Clicking text/name opens ProductDrawer */}
                <div className="mt-3 flex flex-col items-center justify-center text-center">
                  <button
                    type="button"
                    onClick={() => setDrawerProduct(product)}
                    className="font-editorial text-[13px] leading-tight text-deep-ink/90 transition-colors hover:text-crimson cursor-pointer md:text-[14px] focus-visible:outline-none"
                  >
                    {product.name}
                  </button>
                  <span className="mt-1 text-[8px] uppercase tracking-[0.18em] text-basalt/55">
                    {product.meta}
                  </span>
                  <span className="mt-0.5 text-[9px] tracking-[0.14em] text-deep-ink/75">
                    {product.price}
                  </span>
                  {isSelected && activeMode === "style" && (
                    <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.24em] text-deep-ink">
                      [ SELECTED ]
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      <footer className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 pb-5 pt-4 text-[9px] tracking-[0.18em] text-basalt/55 md:px-10 md:pb-6">
        <span className="text-deep-ink/65">37.7749° N / 122.4194° W</span>
        <span>MMXXVI</span>
      </footer>

      <AnimatePresence>
        {selected.length > 0 && activeMode === "style" && (
          <motion.div
            initial={reduceMotion ? false : { y: 26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: 26, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center px-5 pb-6 md:pb-8"
          >
            <div className="pointer-events-auto flex items-stretch border border-deep-ink bg-deep-ink text-white">
              <button
                type="button"
                onClick={clearSelection}
                aria-label="Clear selection"
                className="border-r border-white/15 px-5 text-[10px] uppercase tracking-widest text-gray-400 transition-colors cursor-none hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-3px] focus-visible:outline-white md:px-6"
              >
                CLEAR
              </button>

              <button
                type="button"
                onClick={styleOutfit}
                className="flex items-center gap-5 px-7 py-4 transition-colors duration-500 hover:bg-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-3px] focus-visible:outline-white md:px-9"
              >
                <span className="text-[10px] uppercase tracking-[0.32em]">
                  STYLE OUTFIT
                </span>
                <span aria-hidden="true" className="h-px w-6 bg-white/30" />
                <span className="text-[10px] tracking-[0.2em] text-white/60">
                  {count}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Drawer for Buying / Sizing */}
      <ProductDrawer
        key={drawerProduct?.id ?? "none"}
        product={drawerProduct}
        onClose={() => setDrawerProduct(null)}
      />
    </main>
  );
}
