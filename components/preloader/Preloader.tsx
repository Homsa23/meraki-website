"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const HOLD_MS = 2000;
const EXIT_S = 0.55;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Preloader() {
  const reduceMotion = useReducedMotion() === true;
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    let timeout = 0;

    if (reduceMotion) {
      frame = window.requestAnimationFrame(() => setCount(100));
      timeout = window.setTimeout(() => setVisible(false), HOLD_MS);
    } else {
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / HOLD_MS, 1);
        setCount(Math.round(progress * 100));

        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        } else {
          // Let 100 land before the overlay starts leaving.
          timeout = window.setTimeout(() => setVisible(false), 180);
        }
      };

      frame = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [reduceMotion]);

  // Lock the page underneath while the overlay is on screen.
  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : EXIT_S, ease: EASE }}
          aria-hidden="true"
          data-preloader="true"
          className="fixed inset-0 z-[100] flex select-none flex-col items-center justify-center bg-white text-deep-ink"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: EASE }}
            className="flex flex-col items-center"
          >
            <span className="font-editorial text-[clamp(2.75rem,9vw,6rem)] leading-none tracking-[0.18em] text-deep-ink">
              MERAKI
            </span>

            <span className="mt-5 inline-block w-[4ch] text-center font-mono text-xs tabular-nums tracking-[0.32em] text-deep-ink/60">
              {String(count).padStart(2, "0")}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
