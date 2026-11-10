"use client";

import { useActionState, type FormEvent } from "react";
import { createDropAction } from "@/features/drops/actions";
import { dropCategories, initialCreateDropState } from "@/features/drops/schema";

const fieldClass =
  "mt-2 min-h-12 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary";
const categories: Record<(typeof dropCategories)[number], string> = {
  gaming: "Gaming",
  technology: "Technology",
  learning: "Learning",
  sports: "Sports",
  social: "Social",
  discussions: "Discussions",
  entertainment: "Entertainment",
  lifestyle: "Lifestyle",
  other: "Other",
};

function FieldError({ children }: { children?: string }) {
  return children ? <p className="mt-1 text-xs text-danger">{children}</p> : null;
}

export function CreateDropForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(createDropAction, initialCreateDropState);

  function convertLocalStart(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const localStart = form.elements.namedItem("startLocal");
    const startsAt = form.elements.namedItem("startsAt");
    if (!(localStart instanceof HTMLInputElement) || !(startsAt instanceof HTMLInputElement)) return;
    if (!localStart.value) {
      startsAt.value = "";
      return;
    }

    const parsed = new Date(localStart.value);
    startsAt.value = Number.isNaN(parsed.valueOf()) ? "" : parsed.toISOString();
  }

  return (
    <form action={action} onSubmit={convertLocalStart} className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="title">What are you doing?</label>
        <input autoComplete="off" className={fieldClass} id="title" maxLength={100} minLength={3} name="title" placeholder="A relaxed chess game" required />
        <FieldError>{state.fieldErrors?.title}</FieldError>
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="description">Add a short description</label>
        <textarea className={`${fieldClass} min-h-28 resize-y`} id="description" maxLength={1000} name="description" placeholder="Share what you'd like to do and who might enjoy joining." required rows={4} />
        <FieldError>{state.fieldErrors?.description}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="category">Category</label>
          <select className={fieldClass} defaultValue="learning" id="category" name="category">
            {dropCategories.map((category) => <option key={category} value={category}>{categories[category]}</option>)}
          </select>
          <FieldError>{state.fieldErrors?.category}</FieldError>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="maxParticipants">Maximum participants</label>
          <select className={fieldClass} defaultValue="4" id="maxParticipants" name="maxParticipants">
            {Array.from({ length: 19 }, (_, index) => index + 2).map((count) => (
              <option key={count} value={count}>{count} people</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">Includes you as the creator.</p>
          <FieldError>{state.fieldErrors?.maxParticipants}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="durationMinutes">How long will it last?</label>
          <select className={fieldClass} defaultValue="60" id="durationMinutes" name="durationMinutes">
            {[15, 30, 45, 60, 90, 120, 180, 240].map((minutes) => (
              <option key={minutes} value={minutes}>{minutes < 60 ? `${minutes} minutes` : `${minutes / 60} hour${minutes === 60 ? "" : "s"}`}</option>
            ))}
          </select>
          <FieldError>{state.fieldErrors?.durationMinutes}</FieldError>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="visibility">Who can see it?</label>
          <select className={fieldClass} defaultValue="public" id="visibility" name="visibility">
            <option value="public">Public — discoverable by everyone</option>
            <option value="private">Private — only you and members</option>
          </select>
          <FieldError>{state.fieldErrors?.visibility}</FieldError>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="startLocal">Schedule a start <span className="font-normal text-muted">(optional)</span></label>
        <input className={fieldClass} id="startLocal" name="startLocal" type="datetime-local" />
        <input name="startsAt" type="hidden" />
        <p className="mt-1 text-xs text-muted">Leave blank to start now. Scheduled starts can be up to 7 days away; times use your device&apos;s local timezone.</p>
        <FieldError>{state.fieldErrors?.startsAt}</FieldError>
      </div>

      {state.message && (
        <p className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm leading-6 text-danger" role="alert">
          {state.message}
        </p>
      )}

      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        disabled={!configured || pending}
        type="submit"
      >
        {pending ? "Creating your Drop…" : "Create Drop"}
      </button>
    </form>
  );
}
