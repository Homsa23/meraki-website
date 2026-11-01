"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Product = {
  id: string;
  name: string;
  meta: string;
  price: string;
  src: string;
  width: number;
  height: number;
  /** Responsive height of the PNG. Width follows the intrinsic ratio. */
  frame: string;
  /** Responsive resting position inside the drag stage. */
  place: string;
};

type FloatingProductGalleryProps = {
  gender: "MEN" | "WOMEN";
  index: string;
};

/* -------------------------------------------------------------------------- */
/*  PRODUCTS                                                                   */
/*  Placeholder transparent PNGs (pngimg.com) until studio photography lands.  */
/* -------------------------------------------------------------------------- */

const MEN: Product[] = [
  {
    id: "heavy-tee",
    name: "Heavy Cotton Tee",
    meta: "Raw Chalk / 240 gsm",
    price: "€ 95",
    src: "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
    width: 893,
    height: 1024,
    frame: "h-[21svh] max-h-[260px] md:h-[30svh] md:max-h-[330px]",
    place: "left-[4%] top-[7%] md:left-[7%] md:top-[13%]",
  },
  {
    id: "architectural-hoodie",
    name: "Architectural Hoodie",
    meta: "Washer Black",
    price: "€ 210",
    src: "https://pngimg.com/uploads/hoodie/hoodie_PNG24.png",
    width: 1000,
    height: 1000,
    frame: "h-[21svh] max-h-[250px] md:h-[32svh] md:max-h-[340px]",
    place: "left-[55%] top-[2%] md:left-[34%] md:top-[6%]",
  },
  {
    id: "wide-leg-denim",
    name: "Wide Leg Denim",
    meta: "Indigo Rinse",
    price: "€ 185",
    src: "https://pngimg.com/uploads/jeans/jeans_PNG5758.png",
    width: 1000,
    height: 1500,
    frame: "h-[26svh] max-h-[300px] md:h-[36svh] md:max-h-[390px]",
    place: "left-[10%] top-[50%] md:left-[66%] md:top-[10%]",
  },
  {
    id: "structured-overshirt",
    name: "Structured Overshirt",
    meta: "Basalt",
    price: "€ 240",
    src: "https://pngimg.com/uploads/jacket/jacket_PNG8037.png",
    width: 800,
    height: 1200,
    frame: "h-[24svh] max-h-[280px] md:h-[32svh] md:max-h-[350px]",
    place: "left-[56%] top-[46%] md:left-[44%] md:top-[50%]",
  },
];

const WOMEN: Product[] = [
  {
    id: "column-dress",
    name: "Column Dress",
    meta: "Linen Cream",
    price: "€ 260",
    src: "https://pngimg.com/uploads/dress/dress_PNG18.png",
    width: 2539,
    height: 1605,
    frame: "h-[15svh] max-h-[170px] md:h-[22svh] md:max-h-[250px]",
    place: "left-[4%] top-[8%] md:left-[6%] md:top-[14%]",
  },
  {
    id: "cropped-leather",
    name: "Cropped Leather",
    meta: "Espresso",
    price: "€ 420",
    src: "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG8.png",
    width: 679,
    height: 881,
    frame: "h-[20svh] max-h-[230px] md:h-[28svh] md:max-h-[310px]",
    place: "left-[56%] top-[4%] md:left-[60%] md:top-[10%]",
  },
  {
    id: "boxy-heavy-tee",
    name: "Boxy Heavy Tee",
    meta: "Bone / 240 gsm",
    price: "€ 95",
    src: "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png",
    width: 871,
    height: 1024,
    frame: "h-[21svh] max-h-[250px] md:h-[30svh] md:max-h-[330px]",
    place: "left-[10%] top-[50%] md:left-[40%] md:top-[46%]",
  },
  {
    id: "runner",
    name: "Runner",
    meta: "Ochre / Ink",
    price: "€ 165",
    src: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5783.png",
    width: 1500,
    height: 1500,
    frame: "h-[15svh] max-h-[180px] md:h-[20svh] md:max-h-[230px]",
    place: "left-[58%] top-[52%] md:left-[76%] md:top-[52%]",
  },
];

/* -------------------------------------------------------------------------- */
/*  GALLERY                                                                    */
/* -------------------------------------------------------------------------- */

export default function FloatingProductGallery({
  gender,
  index,
}: FloatingProductGalleryProps) {
  const reduceMotion = useReducedMotion() === true;
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const products = gender === "MEN" ? MEN : WOMEN;

  return (
    <main className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-linen-cream text-deep-ink">
      {/* Single-file styling for the floating pieces. */}
      <style>{`
        html, body { background: #E8DDC5; }

        .noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.86' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px 180px;
          mix-blend-mode: multiply;
        }

        /* The shadow follows the PNG alpha channel, not its bounding box. */
        .product-shadow {
          filter:
            drop-shadow(0 26px 22px rgba(8, 9, 12, 0.18))
            drop-shadow(0 7px 10px rgba(8, 9, 12, 0.12));
          transition:
            filter 600ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, filter;
        }

        .product:hover .product-shadow {
          filter:
            drop-shadow(0 34px 30px rgba(8, 9, 12, 0.22))
            drop-shadow(0 9px 14px rgba(8, 9, 12, 0.14));
          transform: scale(1.025);
        }

        [data-dragging="true"] .product-shadow {
          filter:
            drop-shadow(0 40px 36px rgba(8, 9, 12, 0.24))
            drop-shadow(0 12px 18px rgba(8, 9, 12, 0.16));
          transform: scale(1.035);
        }

        @keyframes merakiFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -7px, 0); }
        }

        .product-float {
          animation: merakiFloat 7.5s ease-in-out infinite;
        }

        [data-dragging="true"] .product-float {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .product-float {
            animation: none;
          }

          .product-shadow {
            transition: none;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="noise-layer pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
      />

      <header className="relative z-20 mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 pb-4 pt-5 md:px-10 md:pb-5 md:pt-6">
        <Link
          href="/"
          className="font-editorial text-[15px] tracking-[0.08em] text-deep-ink/80 transition-colors duration-500 hover:text-crimson focus-visible:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        >
          Meraki
        </Link>

        <span className="text-[9px] uppercase tracking-[0.22em] text-basalt/55">
          {gender} / {index}
        </span>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pt-6 md:px-10 md:pt-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.32em] text-basalt/55">
              Collection {index} — Archive 2026
            </p>

            <h1 className="mt-3 font-editorial text-[13vw] font-normal leading-[0.82] tracking-[-0.03em] text-deep-ink/90 md:text-[5.5vw]">
              {gender}
            </h1>
          </div>

          <p className="hidden pb-2 text-right text-[8px] uppercase leading-relaxed tracking-[0.28em] text-basalt/50 md:block">
            Drag to arrange
            <span className="mt-1 block text-basalt/35">04 pieces</span>
          </p>
        </div>

        <p className="mt-3 text-[8px] uppercase tracking-[0.28em] text-basalt/45 md:hidden">
          Drag to arrange
        </p>
      </section>

      {/* The pieces float directly on the paper. No cards, borders or frames. */}
      <section
        ref={stageRef}
        aria-label={`${gender} collection — draggable pieces`}
        className="relative z-10 mx-auto min-h-[420px] w-full max-w-[1500px] flex-1"
      >
        {products.map((product, i) => {
          const dragging = activeId === product.id;

          return (
            <motion.div
              key={product.id}
              drag
              dragConstraints={stageRef}
              dragElastic={0.06}
              dragMomentum={!reduceMotion}
              dragTransition={{ bounceStiffness: 220, bounceDamping: 30 }}
              whileDrag={reduceMotion ? undefined : { scale: 1.02 }}
              onDragStart={() => setActiveId(product.id)}
              onDragEnd={() => setActiveId(null)}
              data-dragging={dragging}
              className={`product absolute cursor-grab touch-none select-none active:cursor-grabbing ${product.place}`}
              style={{ zIndex: dragging ? 60 : 10 + i }}
            >
              <motion.div
                initial={
                  reduceMotion ? false : { opacity: 0, y: 26, scale: 0.96 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 0.1 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className="product-float"
                  style={{ animationDelay: `${i * 1.2}s` }}
                >
                  <Image
                    src={product.src}
                    alt={`${product.name} — ${product.meta}`}
                    width={product.width}
                    height={product.height}
                    sizes="(max-width: 767px) 45vw, 25vw"
                    priority={i < 2}
                    draggable={false}
                    className={`product-shadow pointer-events-none w-auto max-w-none object-contain ${product.frame}`}
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
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </section>

      <footer className="relative z-20 mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 pb-5 pt-4 text-[9px] tracking-[0.18em] text-basalt/55 md:px-10 md:pb-6">
        <span className="text-deep-ink/65">37.7749° N / 122.4194° W</span>
        <span>MMXXVI</span>
      </footer>
    </main>
  );
}
