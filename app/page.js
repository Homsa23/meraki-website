import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ProductGrid from "@/components/products/ProductGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-meraki-cream text-meraki-black flex flex-col font-sans selection:bg-meraki-black selection:text-meraki-cream">
      {/* Brutalist Sticky Navigation */}
      <Navbar />

      {/* Main Brutalist Storefront Content */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <Hero />

        {/* Product Grid Section (Directly Below Hero) */}
        <ProductGrid />

        {/* Brutalist Secondary Specifications Grid */}
        <section className="w-full border-b border-meraki-black bg-meraki-cream">
          <div className="grid grid-cols-1 md:grid-cols-3 font-mono text-xs uppercase tracking-wider text-meraki-black">
            <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-meraki-black">
              <span className="text-meraki-stone block text-[10px] mb-2 font-bold">[ SPECIFICATION ]</span>
              <p className="font-bold text-sm mb-1">UNISEX PROPORTIONS</p>
              <p className="text-meraki-black/70 leading-relaxed">
                Dropped shoulder architecture with tapered waist hem. Fits true to size for an oversized tailored silhouette.
              </p>
            </div>

            <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-meraki-black">
              <span className="text-meraki-stone block text-[10px] mb-2 font-bold">[ FULFILLMENT ]</span>
              <p className="font-bold text-sm mb-1">GLOBAL DISPATCH</p>
              <p className="text-meraki-black/70 leading-relaxed">
                Orders packaged in archival unbleached cotton garment bags. Express courier delivery with signature required.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <span className="text-meraki-stone block text-[10px] mb-2 font-bold">[ GUARANTEE ]</span>
              <p className="font-bold text-sm mb-1">MERAKI ARCHIVE PROTOCOL</p>
              <p className="text-meraki-black/70 leading-relaxed">
                Each piece individually numbered on stamped interior canvas patch. Lifetime repair warranty on all hardware.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Brutalist Raw Monospace Footer */}
      <footer className="w-full bg-meraki-cream font-mono text-xs text-meraki-black py-8 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span>MERAKI APPAREL GROUP &copy; 2026.</span>
          <span className="text-meraki-stone ml-2">ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex gap-6 uppercase tracking-widest text-[11px]">
          <span className="text-meraki-stone">TERMS</span>
          <span className="text-meraki-stone">PRIVACY</span>
          <span className="text-meraki-stone">ARCHIVE INDEX</span>
        </div>
      </footer>
    </div>
  );
}
