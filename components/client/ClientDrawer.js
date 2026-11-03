"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

const INK = "#08090C";

export default function ClientDrawer({ open, onClose }) {
  const reduceMotion = useReducedMotion() === true;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="client-drawer"
          className="fixed inset-0 z-[130]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
          style={{ color: INK }}
        >
          {/* Very light scrim — barely there, just enough to focus the panel. */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close client archive"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-deep-ink/[0.04] backdrop-blur-[2px]"
          />

          {/* Frosted glass panel — no borders, only a whisper of a shadow. */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Client archive"
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white/40 px-7 pb-8 pt-6 shadow-[-32px_0_80px_rgba(8,9,12,0.06)] backdrop-blur-lg md:px-10 md:pb-10 md:pt-8"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-start justify-between">
              <span className="font-editorial text-[13px] lowercase tracking-[0.28em] text-deep-ink/80">
                meraki
                <span className="ml-0.5 align-super text-[7px] tracking-normal">
                  ®
                </span>
              </span>

              <button
                type="button"
                aria-label="Close client archive"
                autoFocus
                onClick={onClose}
                className="-mr-1 px-1 py-1 text-[10px] uppercase tracking-[0.22em] text-deep-ink/70 transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none"
              >
                Close
              </button>
            </div>

            <div className="my-auto w-full max-w-[320px] self-center">
              <h2 className="font-editorial text-[26px] font-normal uppercase leading-none tracking-widest text-deep-ink md:text-[30px]">
                Client Archive
              </h2>

              <form
                className="mt-14"
                onSubmit={(event) => event.preventDefault()}
              >
                <label htmlFor="client-email" className="sr-only">
                  Email Address
                </label>

                <input
                  id="client-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  className="w-full appearance-none rounded-none border-0 border-b border-deep-ink/80 bg-transparent px-0 py-3 text-[11px] tracking-widest text-deep-ink transition-colors duration-500 placeholder:text-deep-ink/40 focus:border-deep-ink focus:outline-none focus:ring-0"
                />

                <button
                  type="submit"
                  className="mt-10 inline-flex text-[10px] font-light uppercase tracking-[0.34em] text-deep-ink transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none"
                >
                  Send access link
                </button>
              </form>
            </div>

            <span className="text-[8px] uppercase tracking-[0.24em] text-deep-ink/40">
              MMXXVI
            </span>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
