import type { Metadata } from "next";
import { FoundationPlaceholder } from "@/components/foundation-placeholder";

export const metadata: Metadata = { title: "Create a Drop" };

export default function CreatePage() {
  return (
    <FoundationPlaceholder
      eyebrow="Create a Drop"
      title="Make room for a good idea."
      description="Drop creation comes after the data model and activity lifecycle are in place. This foundation page does not publish activities yet."
      stage="Stage 3"
    />
  );
}
