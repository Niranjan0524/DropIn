import Link from "next/link";
import { Icon } from "@/components/icon";

export function FoundationPlaceholder({
  eyebrow,
  title,
  description,
  stage,
}: {
  eyebrow: string;
  title: string;
  description: string;
  stage: string;
}) {
  return (
    <section className="mx-auto flex min-h-[68vh] max-w-4xl flex-col justify-center px-5 py-16 sm:px-8">
      <div className="mb-8 grid size-14 place-items-center rounded-[20px] border border-border bg-secondary-surface text-primary">
        <Icon name="spark" className="size-6" />
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary-accent">
        {eyebrow} · Stage 1 foundation
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {description}
      </p>
      <div className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground">
        <span className="size-2 rounded-full bg-secondary-accent" />
        Planned for {stage}
      </div>
      <Link
        href="/"
        className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
      >
        Back to DropIn home <Icon name="arrow-right" className="size-4 rotate-180" />
      </Link>
    </section>
  );
}
