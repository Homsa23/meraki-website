import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*  LOOKBOOK SPREAD                                                            */
/*  A physical open-magazine spread resting on the white page.                 */
/* -------------------------------------------------------------------------- */

export default function LookbookSpread() {
  return (
    <section
      id="lookbook"
      aria-labelledby="lookbook-title"
      className="relative z-10 w-full bg-white px-4 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1360px]">
        <div className="mb-6 flex items-end justify-between md:mb-9">
          <h2
            id="lookbook-title"
            className="text-xs uppercase tracking-widest text-deep-ink"
          >
            Campaign / Lookbook
          </h2>

          <p className="hidden text-xs uppercase tracking-widest text-deep-ink/35 md:block">
            No. 01 — MMXXVI
          </p>
        </div>

        <Link
          href="/men"
          aria-label="Explore Look 01 — shop the men's archive"
          className="group relative block w-full shadow-2xl shadow-black/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-deep-ink"
        >
          <div className="relative grid w-full overflow-hidden bg-[#F9F9F9] md:grid-cols-2">
            {/* LEFT PAGE — lifestyle campaign shot, edge to edge. */}
            <div className="relative h-[58svh] min-h-[420px] overflow-hidden md:h-[78svh] md:max-h-[860px] md:min-h-[620px]">
              <div className="absolute inset-0 bg-[linear-gradient(155deg,#D9D6D0_0%,#C2BEB6_38%,#9C978E_72%,#7E7A72_100%)] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]" />

              {/* Brutalist placeholder composition. */}
              <div aria-hidden="true" className="absolute inset-0">
                <span className="absolute left-[12%] top-[18%] h-[46%] w-[34%] bg-white/10" />
                <span className="absolute right-[8%] top-[8%] h-[62%] w-[18%] bg-black/[0.06]" />
                <span className="absolute bottom-0 left-0 h-[18%] w-full bg-black/[0.08]" />
                <span className="absolute bottom-[18%] left-[12%] h-[1px] w-[34%] bg-white/20" />
              </div>

              <span className="absolute left-5 top-5 z-10 text-[8px] uppercase tracking-[0.32em] text-white/70 md:left-8 md:top-8">
                Campaign — 35mm
              </span>

              <span className="absolute bottom-5 left-5 z-10 text-[8px] uppercase tracking-[0.32em] text-white/55 md:bottom-8 md:left-8">
                Lifestyle Campaign Shot
              </span>
            </div>

            {/* RIGHT PAGE — macro texture above, archival copy below. */}
            <div className="grid md:h-[78svh] md:max-h-[860px] md:min-h-[620px] md:grid-rows-[1.05fr_1fr]">
              {/* Macro texture shot. */}
              <div className="relative h-[26svh] min-h-[200px] overflow-hidden md:h-auto md:min-h-0">
                <div className="absolute inset-0 bg-[#0B0C0F]" />

                {/* Zipper / fabric grain placeholder. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-80 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.14)_0_2px,rgba(255,255,255,0.02)_2px_7px,rgba(0,0,0,0.35)_7px_12px)]"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_60%)]"
                />

                <span className="absolute left-5 top-5 z-10 text-[8px] uppercase tracking-[0.32em] text-white/55 md:left-8 md:top-8">
                  Macro — Texture
                </span>

                <span className="absolute bottom-5 left-5 z-10 text-[8px] uppercase tracking-[0.32em] text-white/40 md:bottom-8 md:left-8">
                  Hardware / Fabric Grain
                </span>
              </div>

              {/* Archival copy. */}
              <div className="flex flex-col justify-between gap-10 px-6 py-8 md:px-10 md:py-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-deep-ink">
                      Look 01
                    </p>

                    <h3 className="mt-3 font-editorial text-[28px] leading-[0.95] tracking-[-0.01em] text-deep-ink md:text-[34px]">
                      The Brutalist Uniform
                    </h3>
                  </div>

                  <span className="font-editorial text-[13px] tracking-[0.14em] text-deep-ink/30">
                    01 / 04
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="max-w-[34ch] text-xs uppercase leading-[1.9] tracking-widest text-deep-ink">
                    240 GSM Heavyweight Cotton
                  </p>

                  <p className="max-w-[38ch] text-[10px] uppercase leading-[1.9] tracking-[0.18em] text-deep-ink/40">
                    Cut for movement. Finished by hand in the archive atelier.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <span className="text-xs uppercase tracking-widest text-deep-ink">
                    Shop the Archive
                  </span>

                  <span className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-deep-ink/60">
                    Explore Look
                    <span
                      aria-hidden="true"
                      className="inline-block h-[1px] w-8 bg-deep-ink/30 transition-all duration-500 group-hover:w-12 group-hover:bg-deep-ink"
                    />
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* CENTER CREASE — gradient shadow plus a hairline fold. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-16 -translate-x-1/2 md:block bg-[linear-gradient(90deg,transparent_0%,rgba(8,9,12,0.10)_46%,rgba(8,9,12,0.16)_50%,rgba(8,9,12,0.08)_54%,transparent_100%)]"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-[1px] -translate-x-1/2 bg-deep-ink/10 md:block"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
