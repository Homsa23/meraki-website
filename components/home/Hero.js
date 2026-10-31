"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import AnnouncementTicker from "@/components/layout/AnnouncementTicker";

const slides = [
  {
    id: "fig-01",
    label: "FIG. 01 — FRONT PROFILE",
    tag: "ASYMMETRICAL CLOSURE",
    src: "/images/asymmetrical-denim-jacket.jpg",
    alt: "Meraki Asymmetrical Denim Jacket - Front View",
  },
  {
    id: "fig-02",
    label: "FIG. 02 — REAR CUT",
    tag: "ARCHITECTURAL DRAPE",
    src: "/images/asymmetrical-denim-jacket-back.jpg",
    alt: "Meraki Asymmetrical Denim Jacket - Back Silhouette",
  },
  {
    id: "fig-03",
    label: "FIG. 03 — MACRO DETAIL",
    tag: "RAW WEAVE & HARDWARE",
    src: "/images/asymmetrical-denim-jacket-detail.jpg",
    alt: "Meraki Asymmetrical Denim Jacket - Zipper & Selvage Detail",
  },
];

const TOTAL_SLIDES = slides.length; // 3
const SECONDS_PER_SLIDE = 4;
const TOTAL_DURATION_MS = TOTAL_SLIDES * SECONDS_PER_SLIDE * 1000; // 12,000ms total

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, openCart } = useCart();

  const progressBarRef = useRef(null);
  const elapsedRef = useRef(0);
  const currentSlideRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Sync ref with hover state
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Global Continuous 12s Timeline loop via requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (!isHoveredRef.current) {
        elapsedRef.current = (elapsedRef.current + delta) % TOTAL_DURATION_MS;
        const progressPercent = (elapsedRef.current / TOTAL_DURATION_MS) * 100;

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${progressPercent}%`;
        }

        // Active hero image derived directly from the bar's position
        const segmentSize = 100 / TOTAL_SLIDES; // 33.333% per slide
        const calculatedIndex = Math.min(
          Math.floor(progressPercent / segmentSize),
          TOTAL_SLIDES - 1
        );

        if (calculatedIndex !== currentSlideRef.current) {
          currentSlideRef.current = calculatedIndex;
          setCurrentSlide(calculatedIndex);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Jump to specific slide segment and continue growing from there without stopping
  const jumpToSlide = (idx) => {
    const targetElapsed = idx * (SECONDS_PER_SLIDE * 1000);
    elapsedRef.current = targetElapsed;
    currentSlideRef.current = idx;
    setCurrentSlide(idx);

    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${(idx / TOTAL_SLIDES) * 100}%`;
    }
  };


  const handleNext = () => {
    const nextIndex = (currentSlideRef.current + 1) % TOTAL_SLIDES;
    jumpToSlide(nextIndex);
  };

  const handlePurchase = () => {
    addItem({
      id: "adj-001",
      title: "ASYMMETRICAL DENIM JACKET",
      size: "SZ: L",
      price: 480.0,
      formattedPrice: "$480.00",
      image: "/images/asymmetrical-denim-jacket.jpg",
    });
    openCart();
  };

  const active = slides[currentSlide] || slides[0];

  return (
    <section className="w-full bg-meraki-cream border-b border-meraki-black rounded-none">
      {/* Streetwear Announcement Ticker Stripe */}
      <AnnouncementTicker />

      {/* Main Brutalist Carousel Image Area (Instant Harsh Cut, Click-to-Advance, Hover to Pause) */}
      <div
        onClick={handleNext}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-[55vh] md:h-[80vh] bg-meraki-cream overflow-hidden flex items-center justify-center border-b border-meraki-black select-none cursor-pointer"
      >
        {/* Render Active Slide with instant, harsh cut (0ms transition time) */}
        <div className="relative w-full h-full transition-none pointer-events-none">
          <Image
            key={active.id}
            src={active.src}
            alt={active.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transition-none"
          />
        </div>


        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 pointer-events-none">
          {isHovered && (
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-meraki-stone bg-meraki-cream px-2 py-1 border border-meraki-stone">
              [ PAUSED ]
            </span>
          )}
          <div className="font-mono text-[10px] sm:text-xs text-meraki-black bg-meraki-cream px-2 py-1 border border-meraki-black">
            [ 0{currentSlide + 1} / 0{slides.length} ]
          </div>
        </div>


        <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] sm:text-xs text-meraki-black bg-meraki-cream px-2 py-1 border border-meraki-black pointer-events-none">
          COLOR: INDIGO / CONTRAST WHITE
        </div>
      </div>

      {/* Brutalist Continuous Global Timeline Navigation Row */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full border-b border-meraki-black bg-meraki-cream font-mono text-[10px] sm:text-xs tracking-wider select-none"
      >
        {/* Single Absolute Background Div Colored meraki-black sitting directly behind the text */}
        <div
          ref={progressBarRef}
          className="bg-meraki-black absolute inset-0 z-0 pointer-events-none rounded-none"
          style={{ width: "0%" }}
        />

        {/* 3 Interactive Tab Buttons */}
        <div className="w-full grid grid-cols-3">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => jumpToSlide(idx)}
              className="py-3.5 px-2 sm:px-4 text-center uppercase border-r last:border-r-0 border-meraki-black cursor-pointer rounded-none focus:outline-none bg-transparent"
            >
              <span className="text-white mix-blend-difference relative z-10 font-mono text-[10px] sm:text-xs font-bold tracking-wider block">
                {`[ 0${idx + 1} // ${slide.tag} ]`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Harsh Headline & Action Area */}
      <div className="w-full px-4 sm:px-8 py-8 sm:py-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-4xl">
          <p className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-meraki-stone mb-2 uppercase">
            [ ARCHIVAL RELEASE ]
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-meraki-black">
            ASYMMETRICAL
            <br />
            DENIM JACKET
          </h1>
          <p className="mt-4 font-mono text-xs sm:text-sm text-meraki-black/80 max-w-xl leading-relaxed">
            Constructed with an off-axis heavy gauge metal closure, structured funnel neck collar, raw edge patch pockets, and articulated darting along the sleeve.
          </p>
        </div>

        {/* Pricing & Brutalist Purchase CTA Button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-4 shrink-0">
          <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-meraki-black">
            $480.00 <span className="text-xs text-meraki-stone font-normal">USD</span>
          </div>

          <button
            type="button"
            onClick={handlePurchase}
            className="w-full sm:w-auto bg-meraki-gold text-meraki-black border border-meraki-black font-mono font-bold text-sm sm:text-base tracking-[0.2em] uppercase px-10 sm:px-14 py-4 sm:py-5 rounded-none transition-colors duration-150 hover:bg-meraki-black hover:text-meraki-cream active:translate-y-0.5 cursor-pointer shadow-none focus:outline-none"
          >
            PURCHASE
          </button>
        </div>
      </div>
    </section>
  );
}
