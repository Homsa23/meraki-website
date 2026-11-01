import FloatingProductGallery from "@/components/collection/FloatingProductGallery";

export const metadata = {
  title: "Women | Meraki",
  description: "The Meraki women's collection — archival garments, series 02.",
};

export default function WomenPage() {
  return <FloatingProductGallery gender="WOMEN" index="02" />;
}
