"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * Elements that read as "clickable" and trigger the expanded cursor ring.
 * The polaroid figures carry role="button"-ish semantics via links, but the
 * data attribute keeps the affordance explicit where markup is abstract.
 */
const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "input",
  "textarea",
  "select",
  "label",
  "[data-cursor='hover']",
].join(", ");

const DOT_SIZE = 6;
const RING_SIZE = 34;
const INK = "#08090C";

export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);

  // A tight spring keeps the dot glued to the pointer while still smoothing
  // out the tiny jitter of raw pointer events.
  const x = useSpring(
    pointerX,
    prefersReducedMotion
      ? { stiffness: 10000, damping: 100 }
      : { stiffness: 900, damping: 55, mass: 0.4 }
  );
  const y = useSpring(
    pointerY,
    prefersReducedMotion
      ? { stiffness: 10000, damping: 100 }
      : { stiffness: 900, damping: 55, mass: 0.4 }
  );

  // The native pointer is hidden globally, so make sure the custom cursor is
  // available on any device that actually produces a mouse pointer — including
  // hybrids whose primary input reports a coarse pointer.
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      if (query.matches) setEnabled(true);
    };
    const handleMouseMove = (event) => {
      if (event.pointerType === "mouse") setEnabled(true);
    };

    sync();
    query.addEventListener("change", sync);
    window.addEventListener("pointermove", handleMouseMove, { passive: true });

    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("pointermove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleMove = (event) => {
      if (event.pointerType === "touch") return;

      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setVisible(true);
    };

    const handleOver = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        setHovering(false);
        return;
      }
      setHovering(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    };

    const handleOut = (event) => {
      // relatedTarget === null means the pointer left the document entirely.
      if (!event.relatedTarget) {
        setVisible(false);
        setHovering(false);
      }
    };

    const handleLeave = () => {
      setVisible(false);
      setHovering(false);
    };
    const handleEnter = () => setVisible(true);
    const handleBlur = () => setVisible(false);

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled, pointerX, pointerY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      data-custom-cursor=""
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
    >
      <motion.span
        className="absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2"
        style={{
          borderRadius: 9999,
          borderStyle: "solid",
          borderColor: INK,
        }}
        animate={{
          width: hovering ? RING_SIZE : DOT_SIZE,
          height: hovering ? RING_SIZE : DOT_SIZE,
          borderWidth: hovering ? 1 : 0,
          backgroundColor: hovering ? "rgba(8, 9, 12, 0)" : INK,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 38,
          mass: 0.5,
        }}
      />
    </motion.div>
  );
}
