import Link from "next/link";

export const metadata = {
  title: "404 | Meraki",
  description: "Page not found. The archive is empty.",
};

/**
 * Rendered inside the root layout and wrapped by app/template.tsx, so the
 * global page transition applies automatically.
 */
export default function NotFound() {
  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col bg-white text-deep-ink"
      style={{ backgroundColor: "#FFFFFF", color: "#08090C" }}
    >
      <style>{`html, body { background: #FFFFFF !important; }`}</style>

      <header className="flex w-full items-center justify-between px-5 pb-4 pt-5 md:px-10 md:pb-5 md:pt-6">
        <Link
          href="/"
          className="font-editorial text-[15px] tracking-[0.08em] text-deep-ink/80 transition-colors duration-500 hover:text-crimson focus-visible:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        >
          Meraki
        </Link>

        <span className="text-[9px] uppercase tracking-[0.22em] text-basalt/55">
          Error / 404
        </span>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
        <h1 className="font-editorial text-[clamp(7rem,26vw,22rem)] font-normal leading-[0.78] tracking-[-0.04em] text-deep-ink">
          404
        </h1>

        <p className="mt-8 text-[9px] uppercase leading-relaxed tracking-[0.32em] text-basalt/60">
          PAGE NOT FOUND / ARCHIVE EMPTY
        </p>

        <Link
          href="/"
          className="mt-12 px-1 py-1 text-[10px] uppercase tracking-[0.28em] text-deep-ink transition-colors duration-500 hover:text-crimson focus-visible:text-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        >
          [ RETURN TO INDEX ]
        </Link>
      </section>

      <footer className="flex w-full items-center justify-between px-5 pb-5 pt-4 text-[9px] tracking-[0.18em] text-basalt/55 md:px-10 md:pb-6">
        <span className="text-deep-ink/65">37.7749° N / 122.4194° W</span>
        <span>MMXXVI</span>
      </footer>
    </main>
  );
}
