import type { Metadata } from "next";
import { FoundationPlaceholder } from "@/components/foundation-placeholder";

export const metadata: Metadata = { title: "My Activities" };

export default function ActivitiesPage() {
  return (
    <FoundationPlaceholder
      eyebrow="My Activities"
      title="Your Drops, all in one place."
      description="Created and joined activities will appear here when Drop creation and participation are implemented. There is no account or activity history connected yet."
      stage="Stages 3–5"
    />
  );
}
