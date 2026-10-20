import type { Metadata } from "next";

import { sacredOffers, pilgrimagePackages } from "@/components/packages/data";
import { CustomPackageChat } from "@/components/packages/CustomPackageChat";
import { OffersSection } from "@/components/packages/OffersSection";
import { PackagesGrid } from "@/components/packages/PackagesGrid";
import { PackagesHero } from "@/components/packages/PackagesHero";

export const metadata: Metadata = {
  title: "Packages | Pure Path",
  description:
    "Explore Pure Path Hajj and Umrah packages with guided support, accommodations, transport, and limited time offers.",
};

export const dynamic = "force-dynamic";

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-[#f8fbfb] text-[#17211f]">
      <PackagesHero />
      <CustomPackageChat />
      <PackagesGrid packages={pilgrimagePackages} />
      <OffersSection offers={sacredOffers} />
    </main>
  );
}
