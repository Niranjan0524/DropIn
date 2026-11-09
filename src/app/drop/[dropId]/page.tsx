import type { Metadata } from "next";
import { FoundationPlaceholder } from "@/components/foundation-placeholder";

export const metadata: Metadata = { title: "Drop" };

export default function DropPage() {
  return (
    <FoundationPlaceholder
      eyebrow="Activity link"
      title="A shared Drop starts here."
      description="Shareable activity pages will be added once Drops, access rules, and sign-in are implemented. No activity details or messages are available from this route yet."
      stage="Stage 7"
    />
  );
}
