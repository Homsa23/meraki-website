"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCart, totalCount } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full bg-meraki-cream border-b border-meraki-black rounded-none transition-colors">
      <div className="w-full flex h-14 sm:h-16 items-center justify-between px-4 sm:px-8">
        {/* Left: Mechanical Hover MENU */}
        <div className="flex-1 flex items-center justify-start">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="group flex items-center text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-meraki-black px-2 py-1 rounded-none focus:outline-none cursor-pointer"
          >
            {/* Custom Mechanical CSS Icon Container */}
            <div className="relative flex flex-col justify-center w-4 h-3.5 mr-2">
              {/* Top Line: collapsed to center minus by default, snaps to top on hover */}
              <span className="absolute inset-x-0 mx-auto h-[1.5px] bg-meraki-black w-0 opacity-0 top-1/2 -translate-y-1/2 group-hover:w-full group-hover:opacity-100 group-hover:top-0 group-hover:translate-y-0 transition-all duration-300 ease-out group-hover:duration-150 pointer-events-none" />

              {/* Middle Line: default static minus line */}
              <span className="absolute inset-x-0 h-[1.5px] bg-meraki-black w-full top-1/2 -translate-y-1/2 pointer-events-none" />

              {/* Bottom Line: collapsed to center minus by default, snaps to bottom on hover */}
              <span className="absolute inset-x-0 mx-auto h-[1.5px] bg-meraki-black w-0 opacity-0 bottom-1/2 translate-y-1/2 group-hover:w-full group-hover:opacity-100 group-hover:bottom-0 group-hover:translate-y-0 transition-all duration-300 ease-out group-hover:duration-150 pointer-events-none" />
            </div>
            MENU
          </button>
        </div>

        {/* Center: Brand Name MERAKI */}
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="text-lg sm:text-2xl font-black tracking-widest uppercase text-meraki-black font-mono select-none hover:opacity-85 transition-opacity"
          >
            MERAKI
          </Link>
        </div>

        {/* Right: CART Button (triggers Cart Drawer) */}
        <div className="flex-1 flex items-center justify-end">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open shopping cart with ${totalCount} items`}
            className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-meraki-black hover:opacity-70 px-2 py-1 transition-opacity duration-150 rounded-none focus:outline-none cursor-pointer"
          >
            CART ({totalCount})
          </button>
        </div>
      </div>

      {/* Simple Brutalist Dropdown Menu when toggled */}
      {menuOpen && (
        <div className="w-full border-t border-meraki-black bg-meraki-cream px-4 sm:px-8 py-6 font-mono text-xs sm:text-sm tracking-widest uppercase grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
          <Link href="#collection" className="hover:underline py-1 text-meraki-black">
            [01] COLLECTION
          </Link>
          <Link href="#archive" className="hover:underline py-1 text-meraki-black">
            [02] ARCHIVE
          </Link>
          <Link href="#about" className="hover:underline py-1 text-meraki-black">
            [03] ABOUT
          </Link>
          <Link href="#contact" className="hover:underline py-1 text-meraki-black">
            [04] CONTACT
          </Link>
        </div>
      )}
    </header>
  );
}
