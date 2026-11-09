import type { Metadata } from "next";
import { FoundationPlaceholder } from "@/components/foundation-placeholder";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <FoundationPlaceholder
      eyebrow="Profile"
      title="A little context for the people you meet."
      description="Profiles and interests will be connected to authentication in a later stage. This page is currently a navigation placeholder and stores no personal information."
      stage="Stage 2"
    />
  );
}
