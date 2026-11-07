import CollectionGrid from "@/components/collection/CollectionGrid";

export const metadata = {
  title: "Women | Meraki",
  description: "The Meraki women's collection — archival garments, series 02.",
};

export default function WomenPage() {
  return <CollectionGrid gender="WOMEN" index="02" />;
}
