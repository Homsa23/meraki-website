"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

const products = [
  {
    id: "adj-001",
    name: "ASYMMETRICAL DENIM - INDIGO",
    price: "$480.00",
    rawPrice: 480.0,
    size: "SZ: L",
    code: "REF: 001",
    frontImage: "/images/asymmetrical-denim-jacket.jpg",
  },
  {
    id: "ah-002",
    name: "ARCHITECTURAL HOODIE - WASHER BLACK",
    price: "$260.00",
    rawPrice: 260.0,
    size: "SZ: M",
    code: "REF: 002",
    frontImage: "/images/meraki-hoodie-front.jpg",
  },
  {
    id: "bht-003",
    name: "BOXY HEAVY TEE - RAW CHALK",
    price: "$140.00",
    rawPrice: 140.0,
    size: "SZ: XL",
    code: "REF: 003",
    frontImage: "/images/meraki-tee-front.jpg",
  },
  {
    id: "wlt-004",
    name: "WIDE LEG TROUSER - DUST STONE",
    price: "$320.00",
    rawPrice: 320.0,
    size: "SZ: 32",
    code: "REF: 004",
    frontImage: "/images/meraki-trouser-front.jpg",
  },
];

export default function ProductGrid() {
  const { addItem, openCart } = useCart();

  const handleProductClick = (product) => {
    addItem({
      id: product.id,
      title: product.name,
      size: product.size,
      price: product.rawPrice,
      formattedPrice: product.price,
      image: product.frontImage,
    });
    openCart();
  };

  // Duplicate product list to enable seamless infinite loop
  const marqueeItems = [...products, ...products];

  return (
    <section className="w-full bg-meraki-cream">
      {/* Section Header with top and bottom 1px borders */}
      <div className="w-full border-t border-b border-meraki-stone px-4 sm:px-8 py-3.5 flex justify-between items-center font-mono text-xs uppercase tracking-widest text-meraki-black bg-meraki-cream select-none">
        <span className="font-bold">[ CATALOG // SERIES 01 ]</span>
        <span className="text-meraki-stone text-[10px] sm:text-xs">
          [ 04 ITEMS AVAILABLE ]
        </span>
      </div>

      {/* Infinite Marquee Outer Container with overflow-hidden */}
      <div className="w-full overflow-hidden border-b border-meraki-stone bg-meraki-cream">
        {/* Embedded CSS ensuring animation is never blocked by CSS caching */}
        <style>{`
          @keyframes marqueeScroll {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marqueeScroll 25s linear infinite;
            will-change: transform;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Continuous Linear Scrolling Flex Track */}
        <div className="marquee-track flex w-max hover:[animation-play-state:paused]">
          {marqueeItems.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              onClick={() => handleProductClick(product)}
              className="relative flex flex-col justify-between bg-meraki-cream cursor-pointer border-r border-meraki-stone w-[80vw] md:w-[25vw] shrink-0 select-none"
            >
              {/* Top item reference indicator */}
              <div className="px-3 pt-3 flex justify-between font-mono text-[9px] text-meraki-stone uppercase tracking-wider">
                <span>{product.code}</span>
              </div>

              {/* Fixed Aspect Ratio Image Container (Static single primary image) */}
              <div className="relative w-full aspect-[4/5] bg-transparent overflow-hidden flex items-center justify-center p-3 sm:p-5">
                <Image
                  src={product.frontImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 80vw, 25vw"
                  className="object-contain p-3 sm:p-5"
                />
              </div>

              {/* Metadata Footer with 1px Top Border */}
              <div className="border-t border-meraki-stone px-3 sm:px-4 py-3 flex justify-between items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-meraki-black bg-meraki-cream">
                <span className="truncate font-semibold">{product.name}</span>
                <span className="shrink-0 font-bold">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
