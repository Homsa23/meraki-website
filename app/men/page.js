import FloatingProductGallery from "@/components/collection/FloatingProductGallery";

export const metadata = {
  title: "Men | Meraki",
  description: "The Meraki men's collection — archival garments, series 01.",
};

export default function MenPage() {
  return <FloatingProductGallery gender="MEN" index="01" />;
}
