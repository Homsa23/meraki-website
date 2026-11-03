"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import ClientDrawer from "@/components/client/ClientDrawer";
import LookbookSpread from "@/components/lookbook/LookbookSpread";

const MotionLink = motion.create(Link);

/* -------------------------------------------------------------------------- */
/*  PALETTE + CONTENT                                                          */
/* -------------------------------------------------------------------------- */

const WHITE = "#FFFFFF";
const INK = "#08090C";

const FRAMES = [
  {
    id: "frame-01",
    src: "/images/meraki-hoodie-front.jpg",
    alt: "Meraki hoodie — front view",
    no: "01",
    label: "Front",
    title: "Men",
    href: "/men",
  },
  {
    id: "frame-02",
    src: "/images/meraki-hoodie-back.jpg",
    alt: "Meraki hoodie — rear view",
    no: "02",
    label: "Rear",
    title: "Women",
    href: "/women",
  },
];

const INDEX_LINKS = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Archive", href: "#frame-01" },
  { label: "Contact", href: "mailto:studio@meraki.example" },
  { label: "Client", action: "client" },
];

/* -------------------------------------------------------------------------- */
/*  HERO                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const reduceMotion = useReducedMotion() === true;
  const [indexOpen, setIndexOpen] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const closeClient = useCallback(() => setClientOpen(false), []);

  useEffect(() => {
    if (!indexOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIndexOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [indexOpen]);

  return (
    <main
      className="relative w-full overflow-x-hidden bg-white text-deep-ink selection:bg-crimson/15 selection:text-deep-ink"
      style={{ backgroundColor: WHITE, color: INK }}
    >
      {/* Single-file hero CSS: paper grain, cinematic reveal, mobile composition. */}
      <style>{`
        html, body { background: ${WHITE}; }

        .noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.86' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px 180px;
          mix-blend-mode: multiply;
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: merakiTicker 34s linear infinite;
          will-change: transform;
        }

        @keyframes merakiTicker {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .frame-image {
          filter: grayscale(1) contrast(1.02);
          transform: scale(1.001);
          transition:
            filter 900ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 1200ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: filter, transform;
        }

        .gender-shade {
          opacity: 0;
          background: linear-gradient(
            to bottom,
            rgba(8, 9, 12, 0.18) 0%,
            rgba(8, 9, 12, 0.58) 100%
          );
          transition: opacity 700ms ease;
        }

        .gender-reveal {
          opacity: 0;
          transform: translateY(10px);
          transition:
            opacity 700ms ease 80ms,
            transform 900ms cubic-bezier(0.22, 1, 0.36, 1) 80ms;
        }

        .gender-word {
          font-family: var(--font-playfair), "Times New Roman", Times, serif;
          font-size: clamp(1.75rem, 8vw, 3rem);
          font-weight: 400;
          letter-spacing: 0.16em;
          line-height: 1;
          text-transform: uppercase;
        }

        @media (min-width: 1024px) {
          .image-stage {
            max-height: min(760px, calc((100vw - 96px) * 0.667));
          }

          .gender-word {
            font-size: clamp(2.25rem, 3.8vw, 3.25rem);
          }
        }

        @media (max-width: 1023px) {
          .frame-card {
            width: min(50vw, 340px);
          }
        }

        @media (max-width: 1023px) and (max-height: 800px) {
          .frame-card {
            width: min(42vh, 260px);
          }
        }

        /* Desktop: a quiet cinematic reveal on hover and keyboard focus. */
        @media (hover: hover) and (pointer: fine) {
          .frame:hover .frame-image,
          .frame:focus-within .frame-image {
            filter: grayscale(1) contrast(1.02) blur(2.5px);
            transform: scale(1.035);
          }

          .frame:hover .gender-shade,
          .frame:focus-within .gender-shade {
            opacity: 1;
          }

          .frame:hover .gender-reveal,
          .frame:focus-within .gender-reveal {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Touch: the collection title sits elegantly on the image by default. */
        @media (hover: none), (pointer: coarse) {
          .gender-shade {
            opacity: 1;
            background: linear-gradient(
              to bottom,
              rgba(8, 9, 12, 0.1) 0%,
              rgba(8, 9, 12, 0.44) 100%
            );
          }

          .gender-reveal {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .frame-image,
          .gender-shade,
          .gender-reveal {
            transition: none;
          }

          .ticker-track {
            animation: none;
          }
        }
      `}</style>

      {/* Heavy magazine-paper grain. */}
      <div
        aria-hidden="true"
        className="noise-layer pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
      />

      {/* HERO — the 100vh polaroid navigation. */}
      <section className="relative flex h-[100svh] min-h-[540px] w-full flex-col overflow-hidden">
        {/* TICKER — a seamless, borderless editorial stripe. */}
        <div className="relative z-30 shrink-0 overflow-hidden bg-white py-2.5">
          <p className="sr-only">New drop arriving — Meraki Archive 2026</p>

          <div aria-hidden="true" className="ticker-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap pr-10 text-[10px] uppercase tracking-widest text-deep-ink sm:text-xs"
                  >
                    New drop arriving — Meraki Archive 2026 —
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="relative z-10 flex min-h-0 flex-1 flex-col"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* TOP BAR */}
          <header className="relative z-30 flex shrink-0 items-center justify-between px-5 pb-4 pt-5 md:px-8 md:pb-5 md:pt-6">
            <button
              type="button"
              aria-label="Open index"
              aria-expanded={indexOpen}
              onClick={() => setIndexOpen(true)}
              className="-ml-1 px-1 py-1 text-[11px] tracking-[0.18em] text-deep-ink transition-colors duration-500 hover:text-crimson focus-visible:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
            >
              [ + ]
            </button>

            <span className="font-editorial text-[13px] tracking-[0.14em] text-basalt/60">
              MMXXVI
            </span>
          </header>

          {/* IMAGE STAGE */}
          <section className="relative z-10 flex min-h-0 flex-1 items-center justify-center lg:px-12 lg:py-8">
            <div className="image-stage relative h-full max-h-[760px] w-full max-w-[1080px] lg:grid lg:grid-cols-2 lg:gap-6">
              {FRAMES.map((frame, i) => {
                const delay = reduceMotion ? 0 : 0.12 + i * 0.08;

                return (
                  <figure
                    key={frame.id}
                    id={frame.id}
                    className={`frame group absolute w-auto max-w-none transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:h-full lg:flex lg:flex-col lg:hover:scale-[1.015] ${
                      i === 0
                        ? "left-[4%] top-1/2 z-20 -translate-y-[58%] -rotate-[3.5deg] lg:translate-y-6 lg:-rotate-1"
                        : "right-[4%] top-1/2 z-10 -translate-y-[42%] rotate-[2.5deg] lg:-translate-y-2 lg:rotate-[1.5deg]"
                    } lg:z-auto`}
                  >
                    <motion.div
                      className="will-change-transform lg:h-full"
                      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.9,
                        delay,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <MotionLink
                        href={frame.href}
                        aria-label={`Shop ${frame.title.toLowerCase()}`}
                        className="frame-card relative block w-full border border-basalt/10 bg-white p-2 shadow-[0_24px_70px_rgba(8,9,12,0.16)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson lg:flex lg:h-full lg:flex-col lg:shadow-[0_24px_70px_rgba(8,9,12,0.12)]"
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-basalt/15 lg:aspect-auto lg:min-h-0 lg:flex-1">
                          <Image
                            src={frame.src}
                            alt={frame.alt}
                            fill
                            sizes="50vw"
                            loading="eager"
                            fetchPriority={i === 0 ? "high" : "auto"}
                            draggable={false}
                            className="frame-image object-cover object-center"
                          />

                          {/* Deep Ink veil — the white title sits on top. */}
                          <span
                            aria-hidden="true"
                            className="gender-shade pointer-events-none absolute inset-0 z-10"
                          />

                          <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
                            <span className="gender-reveal flex flex-col items-center text-center">
                              <span className="mb-2 text-[8px] uppercase tracking-[0.42em] text-white/75">
                                Collection
                              </span>
                              <span className="gender-word text-white">
                                {frame.title}
                              </span>
                            </span>
                          </span>
                        </div>

                        <figcaption className="flex items-center justify-between px-0.5 pb-0.5 pt-2 text-[8px] uppercase tracking-[0.18em] text-basalt/65">
                          <span className="text-deep-ink/70">{frame.label}</span>

                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="h-[6px] w-8 opacity-40"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(90deg, #08090C 0, #08090C 1px, transparent 1px, transparent 3px)",
                              }}
                            />
                            <span className="text-deep-ink/70">No. {frame.no}</span>
                          </span>
                        </figcaption>
                      </MotionLink>
                    </motion.div>
                  </figure>
                );
              })}
            </div>
          </section>

          {/* BOTTOM BAR */}
          <footer className="relative z-30 flex shrink-0 items-center justify-between px-5 pb-5 pt-4 text-[9px] tracking-[0.18em] text-basalt/60 md:px-8 md:pb-6">
            <span className="text-deep-ink/70">37.7749° N / 122.4194° W</span>
            <span className="hidden lg:block">No. 001—002</span>
            <span className="text-deep-ink/70">© 2026</span>
          </footer>

          {/* THE WORDMARK — bottom-center on mobile; rotated 90° on desktop. */}
          <span className="absolute bottom-14 left-1/2 z-30 -translate-x-1/2 font-editorial text-[13px] lowercase tracking-[0.28em] text-basalt/75 lg:bottom-auto lg:left-auto lg:right-3 lg:top-1/2 lg:-translate-x-0 lg:-translate-y-1/2 lg:rotate-90">
            meraki
            <span className="ml-0.5 align-super text-[7px] tracking-normal">®</span>
          </span>
        </motion.div>
      </section>

      <LookbookSpread />

      {/* INDEX OVERLAY */}
      <AnimatePresence>
        {indexOpen && (
          <motion.div
            key="index"
            role="dialog"
            aria-modal="true"
            aria-label="Meraki index"
            className="fixed inset-0 z-[120] flex flex-col bg-white/95 px-5 pb-5 pt-5 backdrop-blur-xl md:px-8 md:pb-6 md:pt-6"
            style={{ color: INK }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-editorial text-2xl text-deep-ink">
                Index
                <span
                  aria-hidden="true"
                  className="h-[4px] w-[4px] rounded-full bg-crimson"
                />
              </span>

              <button
                type="button"
                aria-label="Close index"
                autoFocus
                onClick={() => setIndexOpen(false)}
                className="-mr-1 px-1 py-1 text-[11px] tracking-[0.18em] text-basalt/65 transition-colors duration-500 hover:text-crimson focus-visible:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
              >
                Close
              </button>
            </div>

            <motion.nav
              className="my-auto w-full max-w-[560px] self-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {INDEX_LINKS.map((link) =>
                link.action === "client" ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => {
                      setIndexOpen(false);
                      setClientOpen(true);
                    }}
                    className="block w-full py-3 text-left font-editorial text-3xl text-deep-ink/80 transition-opacity duration-300 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none md:py-4 md:text-4xl"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIndexOpen(false)}
                    className="block py-3 font-editorial text-3xl text-deep-ink/80 transition-opacity duration-300 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none md:py-4 md:text-4xl"
                  >
                    {link.label}
                  </a>
                )
              )}
            </motion.nav>

            <div className="flex justify-between text-[9px] tracking-[0.18em] text-basalt/60">
              <span className="text-deep-ink/70">37.7749° N / 122.4194° W</span>
              <span>MMXXVI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ClientDrawer open={clientOpen} onClose={closeClient} />
    </main>
  );
}
