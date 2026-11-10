"use client";

import { useEffect, useState } from "react";

export function LocalizedDateTime({ iso, variant = "medium" }: { iso: string; variant?: "medium" | "full" }) {
  const initialLabel = `${new Intl.DateTimeFormat("en", {
    dateStyle: variant,
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(iso))} UTC`;
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    setLabel(new Intl.DateTimeFormat(undefined, {
      dateStyle: variant,
      timeStyle: "short",
    }).format(new Date(iso)));
  }, [iso, variant]);

  return <time dateTime={iso}>{label}</time>;
}
