import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DropIn — Don’t plan. Just Drop In.",
    template: "%s | DropIn",
  },
  description:
    "Find people to do something with, right now. DropIn is being built around spontaneous activities and real participation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const t=localStorage.getItem("dropin-theme")||"system";const d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";document.documentElement.style.colorScheme=d?"dark":"light"}catch{}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AppShell>
            <Suspense fallback={
              <div className="mx-auto w-full max-w-7xl px-5 py-16 text-sm text-muted sm:px-8" role="status">
                Loading DropIn…
              </div>
            }>
              {children}
            </Suspense>
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
