import Image from "next/image";
import Link from "next/link";

const WHITE = "#FFFFFF";
const INK = "#08090C";

const PIECES = [
  {
    no: "01",
    name: "Asymmetrical Denim Jacket",
    meta: "Indigo / Contrast White",
    src: "/images/asymmetrical-denim-jacket.jpg",
    alt: "Meraki asymmetrical denim jacket",
  },
  {
    no: "02",
    name: "Architectural Hoodie",
    meta: "Washer Black",
    src: "/images/meraki-hoodie-front.jpg",
    alt: "Meraki architectural hoodie",
  },
  {
    no: "03",
    name: "Boxy Heavy Tee",
    meta: "Raw Chalk",
    src: "/images/meraki-tee-front.jpg",
    alt: "Meraki boxy heavy tee",
  },
  {
    no: "04",
    name: "Wide Leg Trouser",
    meta: "Dust Stone",
    src: "/images/meraki-trouser-front.jpg",
    alt: "Meraki wide leg trouser",
  },
];

export default function CollectionView({ gender, index }) {
  return (
    <main
      className="relative min-h-[100svh] w-full overflow-x-hidden bg-white px-5 pb-5 pt-5 text-deep-ink md:px-8 md:pb-6 md:pt-6"
      style={{ backgroundColor: WHITE, color: INK }}
    >
      <style>{`
        html, body { background: ${WHITE}; }

        .noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.86' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px 180px;
          mix-blend-mode: multiply;
        }

        .piece-image {
          filter: grayscale(1) contrast(1.02);
          transform: scale(1.001);
          transition:
            filter 900ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 1200ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .piece-veil {
          opacity: 0;
          background: rgba(8, 9, 12, 0.18);
          transition: opacity 700ms ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .piece:hover .piece-image {
            filter: grayscale(1) contrast(1.02) blur(1.5px);
            transform: scale(1.035);
          }

          .piece:hover .piece-veil {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .piece-image,
          .piece-veil {
            transition: none;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="noise-layer pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
      />

      <header className="relative z-10 flex items-center justify-between border-b border-basalt/15 pb-4 text-[9px] uppercase tracking-[0.22em] text-basalt/60">
        <Link
          href="/"
          className="font-editorial text-[15px] normal-case tracking-[0.08em] text-deep-ink/80 transition-colors duration-500 hover:text-crimson focus-visible:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        >
          Meraki
        </Link>

        <span>
          {gender} / {index}
        </span>
      </header>

      <section className="relative z-10 pt-10 md:pt-14">
        <p className="text-[9px] uppercase tracking-[0.32em] text-basalt/55">
          Collection {index} — Archive 2026
        </p>

        <h1 className="mt-4 font-editorial text-[24vw] font-normal leading-[0.8] tracking-[-0.04em] text-deep-ink/85 md:text-[11vw]">
          {gender}
        </h1>

        <div className="mt-8 flex items-center justify-between border-t border-basalt/15 pt-4 text-[9px] uppercase tracking-[0.2em] text-basalt/60 md:mt-10">
          <span>04 pieces</span>
          <span>Series 01</span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {PIECES.map((piece) => (
            <article key={piece.no} className="piece group">
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-basalt/10 bg-white p-2 shadow-[0_18px_50px_rgba(8,9,12,0.12)]">
                <div className="relative h-full w-full overflow-hidden bg-basalt/15">
                  <Image
                    src={piece.src}
                    alt={piece.alt}
                    fill
                    sizes="(max-width: 767px) 50vw, 25vw"
                    className="piece-image object-cover object-center"
                  />

                  <span
                    aria-hidden="true"
                    className="piece-veil pointer-events-none absolute inset-0"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-start justify-between gap-3">
                <span>
                  <span className="block font-editorial text-[16px] leading-tight text-deep-ink/85">
                    {piece.name}
                  </span>
                  <span className="mt-1.5 block text-[8px] uppercase tracking-[0.18em] text-basalt/60">
                    {piece.meta}
                  </span>
                </span>

                <span className="pt-0.5 text-[8px] uppercase tracking-[0.18em] text-basalt/55">
                  {piece.no}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="relative z-10 mt-12 flex items-center justify-between border-t border-basalt/15 pt-4 text-[9px] tracking-[0.18em] text-basalt/60 md:mt-16">
        <span className="text-deep-ink/70">37.7749° N / 122.4194° W</span>
        <span>MMXXVI</span>
      </footer>
    </main>
  );
}
