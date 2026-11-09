"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icon";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation: { label: string; href: string; icon: IconName }[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Explore", href: "/explore", icon: "compass" },
  { label: "Create", href: "/create", icon: "plus" },
  { label: "Activities", href: "/activities", icon: "layers" },
  { label: "Profile", href: "/profile", icon: "user" },
];

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function Brand() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="DropIn home">
      <span className="relative grid size-10 place-items-center rounded-2xl bg-primary text-background shadow-sm transition group-hover:-rotate-3">
        <span className="absolute size-5 rounded-full border border-current opacity-70" />
        <span className="size-1.5 rounded-full bg-secondary-accent" />
      </span>
      <span className="text-[15px] font-black tracking-[0.18em] text-foreground">DROPIN</span>
    </Link>
  );
}

function NavLink({
  item,
  compact = false,
  active,
}: {
  item: (typeof navigation)[number];
  compact?: boolean;
  active: boolean;
}) {
  const isCreate = item.href === "/create";

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={[
        "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
        compact ? "min-w-0 flex-col gap-1 px-2 py-1.5 text-[10px]" : "px-3 py-2 text-sm",
        isCreate && !compact
          ? "bg-primary px-4 text-background hover:bg-primary-hover"
          : active
            ? "bg-secondary-surface text-primary"
            : "text-muted hover:bg-secondary-surface hover:text-foreground",
        isCreate && compact ? "text-secondary-accent" : "",
      ].join(" ")}
    >
      <Icon name={item.icon} className={compact ? "size-5" : "size-4"} />
      <span className={compact ? "truncate" : ""}>{isCreate && !compact ? "Create a Drop" : item.label}</span>
    </Link>
  );
}

function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
      {navigation.filter((item) => item.href !== "/create").map((item) => (
        <NavLink key={item.href} item={item} active={isCurrentPath(pathname, item.href)} />
      ))}
    </nav>
  );
}

function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[22px] border border-border bg-surface/95 p-1.5 shadow-[var(--soft-shadow)] backdrop-blur-xl lg:hidden"
    >
      {navigation.map((item) => (
        <NavLink key={item.href} item={item} compact active={isCurrentPath(pathname, item.href)} />
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-surface px-4 py-2 text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
          <Brand />

          <Suspense fallback={<nav aria-label="Main navigation" className="hidden lg:block" />}>
            <DesktopNavigation />
          </Suspense>

          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="hidden size-10 items-center justify-center rounded-full text-muted transition hover:bg-secondary-surface hover:text-foreground sm:inline-flex"
            >
              <Icon name="bell" className="size-[18px]" />
            </Link>
            <ThemeToggle />
            <Link
              href="/create"
              className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-primary-hover lg:inline-flex"
            >
              <Icon name="plus" className="size-4" />
              Create a Drop
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 pb-24 lg:pb-0">
        {children}
      </main>

      <footer className="hidden border-t border-border/80 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5 text-xs text-muted">
          <span>DROPIN · Don’t plan. Just Drop In.</span>
          <span>Building for the moments happening now.</span>
        </div>
      </footer>

      <Suspense fallback={<nav aria-label="Mobile navigation" className="lg:hidden" />}>
        <MobileNavigation />
      </Suspense>
    </div>
  );
}
