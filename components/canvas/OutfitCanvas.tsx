"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  getOutfitSnapshot,
  getProductsByIds,
  getServerOutfitSnapshot,
  OUTFIT_SERVER_SNAPSHOT,
  parseStoredOutfit,
  subscribeToOutfit,
} from "@/lib/collection";

/* -------------------------------------------------------------------------- */
/*  RESTING SLOTS                                                              */
/*  Absolute, edge-anchored positions so pieces arrive casually scattered.     */
/* -------------------------------------------------------------------------- */

type Slot = {
  place: string;
  frame: string;
};

const SLOTS: Slot[] = [
  {
    place: "left-[3%] top-[6%] md:left-[7%] md:top-[10%]",
    frame: "h-[22svh] max-h-[210px] md:h-[30svh] md:max-h-[310px]",
  },
  {
    place: "right-[3%] top-[2%] md:right-[8%] md:top-[4%]",
    frame: "h-[20svh] max-h-[190px] md:h-[27svh] md:max-h-[280px]",
  },
  {
    place: "left-[12%] bottom-[7%] md:left-[30%] md:bottom-[10%]",
    frame: "h-[24svh] max-h-[230px] md:h-[32svh] md:max-h-[330px]",
  },
  {
    place: "right-[5%] bottom-[5%] md:right-[6%] md:bottom-[12%]",
    frame: "h-[19svh] max-h-[180px] md:h-[25svh] md:max-h-[255px]",
  },
  {
    place: "left-[36%] top-[36%] md:left-[44%] md:top-[32%]",
    frame: "h-[21svh] max-h-[200px] md:h-[28svh] md:max-h-[290px]",
  },
  {
    place: "right-[32%] bottom-[30%] md:right-[34%] md:bottom-[26%]",
    frame: "h-[20svh] max-h-[190px] md:h-[26svh] md:max-h-[270px]",
  },
  {
    place: "left-[22%] top-[24%] md:left-[20%] md:top-[22%]",
    frame: "h-[20svh] max-h-[190px] md:h-[27svh] md:max-h-[280px]",
  },
  {
    place: "right-[20%] top-[30%] md:right-[22%] md:top-[28%]",
    frame: "h-[19svh] max-h-[180px] md:h-[25svh] md:max-h-[255px]",
  },
];

export default function OutfitCanvas() {
  const reduceMotion = useReducedMotion() === true;
  const stageRef = useRef<HTMLDivElement>(null);
  const rawOutfit = useSyncExternalStore(
    subscribeToOutfit,
    getOutfitSnapshot,
    getServerOutfitSnapshot
  );
  const outfit = useMemo(() => parseStoredOutfit(rawOutfit), [rawOutfit]);
  const products = useMemo(
    () => getProductsByIds(outfit.ids),
    [outfit.ids]
  );
  const collection = outfit.collection;
  const ready = rawOutfit !== OUTFIT_SERVER_SNAPSHOT;
  const [activeId, setActiveId] = useState<string | null>(null);

  const backHref =
    collection === "WOMEN" ? "/women" : collection === "MEN" ? "/men" : "/";
  const backLabel = collection ? `Back to ${collection.toLowerCase()}` : "Back";

  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-white text-deep-ink"
      style={{ backgroundColor: "#FFFFFF", color: "#08090C" }}
    >
      <style>{`
        html, body { background: #FFFFFF !important; }

        .canvas-shadow {
          filter:
            drop-shadow(0 26px 22px rgba(8, 9, 12, 0.18))
            drop-shadow(0 7px 10px rgba(8, 9, 12, 0.12));
          transition:
            filter 600ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, filter;
        }

        .canvas-item:hover .canvas-shadow {
          filter:
            drop-shadow(0 34px 30px rgba(8, 9, 12, 0.22))
            drop-shadow(0 9px 14px rgba(8, 9, 12, 0.14));
          transform: scale(1.025);
        }

        [data-dragging="true"] .canvas-shadow {
          filter:
            drop-shadow(0 40px 36px rgba(8, 9, 12, 0.24))
            drop-shadow(0 12px 18px rgba(8, 9, 12, 0.16));
          transform: scale(1.035);
        }

        @media (prefers-reduced-motion: reduce) {
          .canvas-shadow {
            transition: none;
          }
        }
      `}</style>

      <header className="relative z-20 flex w-full items-center justify-between px-5 pb-4 pt-5 md:px-10 md:pb-5 md:pt-6">
        <Link
          href="/"
          className="font-editorial text-[15px] tracking-[0.08em] text-deep-ink/80 transition-colors duration-500 hover:text-crimson focus-visible:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        >
          Meraki
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href={backHref}
            className="text-[9px] uppercase tracking-[0.22em] text-basalt/55 transition-colors duration-500 hover:text-deep-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
          >
            {backLabel}
          </Link>

          <span className="text-[9px] uppercase tracking-[0.22em] text-basalt/55">
            Canvas / Outfit
          </span>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pt-4 md:px-10 md:pt-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.32em] text-basalt/55">
              Outfit Canvas
            </p>

            <h1 className="mt-3 font-editorial text-[11vw] font-normal leading-[0.82] tracking-[-0.03em] text-deep-ink/90 md:text-[4.5vw]">
              STYLE
            </h1>
          </div>

          {ready && products.length > 0 && (
            <p className="hidden pb-2 text-right text-[8px] uppercase leading-relaxed tracking-[0.28em] text-basalt/50 md:block">
              Drag to compose
              <span className="mt-1 block text-basalt/35">
                {String(products.length).padStart(2, "0")} pieces
              </span>
            </p>
          )}
        </div>

        {ready && products.length > 0 && (
          <p className="mt-3 text-[8px] uppercase tracking-[0.28em] text-basalt/45 md:hidden">
            Drag to compose
          </p>
        )}
      </section>

      {ready && products.length > 0 ? (
        <section
          ref={stageRef}
          aria-label="Outfit canvas — draggable pieces"
          className="relative z-10 min-h-[520px] w-full flex-1"
        >
          {products.map((product, i) => {
            const slot = SLOTS[i % SLOTS.length];
            const dragging = activeId === product.id;
            const front = product.images[0];

            return (
              <motion.div
                key={product.id}
                drag
                dragConstraints={stageRef}
                dragElastic={0.06}
                dragMomentum={!reduceMotion}
                dragTransition={{ bounceStiffness: 220, bounceDamping: 30 }}
                whileDrag={{ scale: 1.05, zIndex: 50 }}
                onDragStart={() => setActiveId(product.id)}
                onDragEnd={() => setActiveId(null)}
                data-dragging={dragging}
                className={`canvas-item absolute cursor-grab touch-none select-none active:cursor-grabbing ${slot.place}`}
                style={{ zIndex: dragging ? 60 : 10 + i }}
              >
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.08 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Image
                    src={front.src}
                    alt={`${product.name} — ${product.meta}`}
                    width={front.width}
                    height={front.height}
                    sizes="(max-width: 767px) 45vw, 25vw"
                    priority={i < 2}
                    draggable={false}
                    className={`canvas-shadow pointer-events-none w-auto max-w-none object-contain ${slot.frame}`}
                  />

                  <div className="pointer-events-none mt-3 flex items-baseline gap-2.5">
                    <span className="font-editorial text-[13px] leading-none text-deep-ink/80 md:text-[15px]">
                      {product.name}
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.18em] text-basalt/50">
                      {product.meta}
                    </span>
                    <span className="ml-auto text-[8px] tracking-[0.14em] text-basalt/45">
                      {product.price}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </section>
      ) : (
        <section className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 py-20 text-center">
          {ready ? (
            <>
              <p className="font-editorial text-[26px] leading-tight text-deep-ink/85 md:text-[34px]">
                Nothing selected yet
              </p>
              <p className="max-w-[300px] text-[9px] uppercase leading-relaxed tracking-[0.28em] text-basalt/50">
                Choose pieces from a collection, then style the outfit here
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Link
                  href="/men"
                  className="border border-deep-ink px-5 py-3 text-[9px] uppercase tracking-[0.28em] text-deep-ink transition-colors duration-500 hover:bg-deep-ink hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
                >
                  Men
                </Link>
                <Link
                  href="/women"
                  className="border border-deep-ink px-5 py-3 text-[9px] uppercase tracking-[0.28em] text-deep-ink transition-colors duration-500 hover:bg-deep-ink hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
                >
                  Women
                </Link>
              </div>
            </>
          ) : (
            <span className="sr-only">Loading outfit</span>
          )}
        </section>
      )}

      <footer className="relative z-20 flex w-full items-center justify-between px-5 pb-5 pt-4 text-[9px] tracking-[0.18em] text-basalt/55 md:px-10 md:pb-6">
        <span className="text-deep-ink/65">37.7749° N / 122.4194° W</span>
        <span>MMXXVI</span>
      </footer>
    </main>
  );
}
