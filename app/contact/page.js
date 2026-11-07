import Link from "next/link";

export const metadata = {
  title: "Contact & Policy | Meraki",
  description: "Contact inquiries and archive store policy.",
};

export default function ContactPage() {
  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col bg-white text-deep-ink"
      style={{ backgroundColor: "#FFFFFF", color: "#08090C" }}
    >
      <style>{`html, body { background: #FFFFFF !important; }`}</style>

      {/* Header */}
      <header className="flex w-full items-center justify-between px-5 pb-4 pt-5 md:px-10 md:pb-5 md:pt-6">
        <Link
          href="/"
          className="font-editorial text-[15px] tracking-[0.08em] text-deep-ink/80 transition-colors duration-500 hover:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        >
          Meraki
        </Link>

        <span className="text-[9px] uppercase tracking-[0.22em] text-basalt/55">
          Contact / Policy
        </span>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-5 pt-8 pb-24 md:px-10 md:pt-14 md:pb-32">
        {/* Contact Intro */}
        <section className="mb-16 md:mb-24">
          <p className="text-[9px] uppercase tracking-[0.32em] text-basalt/55">
            Client Relations
          </p>
          <h1 className="mt-3 font-editorial text-[10vw] font-normal leading-[0.85] tracking-[-0.03em] text-deep-ink/90 sm:text-[6vw] md:text-[4.5vw]">
            INQUIRIES
          </h1>

          <div className="mt-8 flex flex-col gap-3 font-mono text-xs uppercase tracking-widest text-deep-ink">
            <a
              href="mailto:inquiries@meraki.com"
              className="text-sm font-bold tracking-widest underline underline-offset-4 transition-colors hover:text-crimson md:text-base"
            >
              INQUIRIES@MERAKI.COM
            </a>
            <span className="text-[10px] tracking-wider text-gray-500">
              STUDIO RESPONSE WINDOW: 24—48 HOURS
            </span>
          </div>
        </section>

        {/* Brutalist Store Policy Section */}
        <section
          aria-label="Store policies"
          className="flex flex-col gap-12 sm:gap-16 pt-4"
        >
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-deep-ink">
              ALL SALES FINAL
            </h2>
            <p className="mt-2.5 max-w-md text-[10px] sm:text-xs text-gray-500 uppercase leading-relaxed">
              ALL SALES ARE FINAL DUE TO THE EXCLUSIVE NATURE OF THE ARCHIVE. WE DO NOT OFFER RETURNS OR EXCHANGES. PLEASE REVIEW YOUR ORDER CAREFULLY BEFORE COMPLETING YOUR PURCHASE.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-deep-ink">
              ORDER ISSUES
            </h2>
            <p className="mt-2.5 max-w-md text-[10px] sm:text-xs text-gray-500 uppercase leading-relaxed">
              IF AN ITEM IS INCORRECT OR DEFECTIVE, EMAIL US AT INQUIRIES@MERAKI.COM AND WE WILL TAKE RESPONSIBILITY AND RESOLVE IT PROMPTLY. PLEASE INCLUDE YOUR ORDER NUMBER AND A BRIEF DESCRIPTION.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 pb-5 pt-4 text-[9px] tracking-[0.18em] text-basalt/55 md:px-10 md:pb-6">
        <span className="text-deep-ink/65">37.7749° N / 122.4194° W</span>
        <span>MMXXVI</span>
      </footer>
    </main>
  );
}

