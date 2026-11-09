import type { Metadata } from "next";
import { FoundationPlaceholder } from "@/components/foundation-placeholder";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <FoundationPlaceholder
      eyebrow="Notifications"
      title="Keep up with the moments you join."
      description="Notifications will be considered after the core Drop and participation flows work. No notifications are being collected or sent in this foundation build."
      stage="Post-release planning"
    />
  );
}
