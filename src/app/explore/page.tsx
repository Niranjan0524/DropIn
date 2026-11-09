import type { Metadata } from "next";
import { FoundationPlaceholder } from "@/components/foundation-placeholder";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  return (
    <FoundationPlaceholder
      eyebrow="Explore"
      title="Find what’s happening now."
      description="Live activity discovery is planned for a later stage. This page will surface current, joinable Drops and let you explore by category once the backend is connected."
      stage="Stage 4"
    />
  );
}
