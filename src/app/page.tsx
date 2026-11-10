import Link from "next/link";
import { Icon } from "@/components/icon";

const steps = [
  {
    number: "01",
    title: "Make the moment",
    text: "Start a small, time-bound activity around something you feel like doing.",
    tone: "text-secondary-accent",
  },
  {
    number: "02",
    title: "Find your people",
    text: "See what is happening now and join while there is still room.",
    tone: "text-primary",
  },
  {
    number: "03",
    title: "Do it together",
    text: "Meet in a dedicated activity space and turn an idea into participation.",
    tone: "text-tertiary-accent",
  },
];

const categories = ["Gaming", "Learning", "Technology", "Sports", "Social", "Ideas"];

export default function Home() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold tracking-wide text-muted shadow-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary-accent opacity-35 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-secondary-accent" />
            </span>
            A new way to spend your right now
          </div>
          <h1 className="max-w-3xl text-[clamp(3.25rem,8vw,6.8rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-foreground">
            Don’t plan.
            <br />
            <span className="relative inline-block text-primary">
              Just Drop In.
              <svg
                aria-hidden="true"
                viewBox="0 0 360 18"
                className="absolute -bottom-2 left-1 w-[90%] text-secondary-accent sm:-bottom-3"
                fill="none"
              >
                <path d="M4 12C83 3 252 2 356 10" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Find someone to play chess, think out loud, study together, or simply talk —
            at the moment you feel like it.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/create"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-background shadow-sm transition hover:bg-primary-hover"
            >
              Create a Drop <Icon name="arrow-right" className="size-4" />
            </Link>
            <Link
              href="/activities"
              className="inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-foreground transition hover:bg-secondary-surface"
            >
              My Activities
            </Link>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">
            Create an activity now. Live discovery and joining are coming in the next stages.
          </p>
        </div>

        <div aria-label="Illustration of spontaneous activity becoming a shared moment" role="img" className="relative mx-auto aspect-square w-full max-w-[480px]">
          <div className="absolute inset-[8%] rounded-full border border-border/80" />
          <div className="absolute inset-[19%] rounded-full border border-border/80" />
          <div className="absolute inset-[30%] rounded-full border border-border/80" />
          <div className="absolute inset-[20%] rotate-[-22deg] rounded-[38%] bg-secondary-surface/70" />
          <div className="absolute inset-[30%] rotate-[18deg] rounded-[36%] border border-primary/20 bg-surface shadow-[var(--soft-shadow)]" />
          <div className="absolute inset-[37%] grid place-items-center rounded-[32%] bg-primary text-background shadow-xl">
            <div className="text-center">
              <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-background/10">
                <Icon name="spark" className="size-6" />
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] opacity-70">One idea</span>
              <span className="mt-1 block text-lg font-semibold tracking-tight">Shared moment</span>
            </div>
          </div>
          <div className="absolute left-[7%] top-[27%] rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg sm:left-[4%]">
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-muted">Feel like</span>
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="size-2 rounded-full bg-secondary-accent" />
              Doing something
            </span>
          </div>
          <div className="absolute bottom-[22%] right-[1%] rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg sm:right-[-2%]">
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-muted">The DropIn idea</span>
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="grid size-6 place-items-center rounded-lg bg-secondary-surface text-primary">
                <Icon name="plus" className="size-3.5" />
              </span>
              Meet in the moment
            </span>
          </div>
          <span className="absolute right-[19%] top-[11%] size-3 rounded-full bg-tertiary-accent" />
          <span className="absolute bottom-[12%] left-[20%] size-2 rounded-full bg-secondary-accent" />
          <span className="absolute right-[10%] top-[52%] size-2 rounded-full bg-primary" />
        </div>
      </section>

      <section id="the-loop" className="border-y border-border bg-surface/70">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-accent">The DropIn loop</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
                From “anyone up for it?” to “let’s go.”
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              Temporary activities make it easier to turn a passing thought into something you do together.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="rounded-[26px] border border-border bg-background p-6 sm:p-7">
                <span className={`text-sm font-bold tracking-[0.12em] ${step.tone}`}>{step.number}</span>
                <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary-accent">A little bit of everything</p>
          <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
            Your interests are an invitation.
          </h2>
        </div>
        <div>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            Drops are designed for small, spontaneous activities across all kinds of interests. These are examples of future categories, not live listings.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Planned activity categories">
            {categories.map((category, index) => (
              <li
                key={category}
                className={`rounded-full border px-4 py-2.5 text-sm font-medium ${
                  index % 3 === 0
                    ? "border-primary/20 bg-secondary-surface text-primary"
                    : index % 3 === 1
                      ? "border-secondary-accent/20 bg-secondary-accent/5 text-secondary-accent"
                      : "border-tertiary-accent/20 bg-tertiary-accent/5 text-tertiary-accent"
                }`}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="flex flex-col gap-5 rounded-[28px] bg-primary px-6 py-7 text-background sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-8">
          <div className="flex items-start gap-4">
            <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl bg-background/10">
              <Icon name="spark" className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">We’re building the place where plans happen.</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-background/75">
                You can create and manage your Drops now. Live discovery, joining, and chat are on the roadmap.
              </p>
            </div>
          </div>
          <Link
            href="/create"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-background px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-secondary-surface sm:self-auto"
          >
            Start a Drop <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
