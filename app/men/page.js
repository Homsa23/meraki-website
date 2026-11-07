import CollectionGrid from "@/components/collection/CollectionGrid";

export const metadata = {
  title: "Men | Meraki",
  description: "The Meraki men's collection — archival garments, series 01.",
};

export default function MenPage() {
  return <CollectionGrid gender="MEN" index="01" />;
}
