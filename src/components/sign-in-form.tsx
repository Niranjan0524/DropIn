"use client";

import { useActionState } from "react";
import { Icon } from "@/components/icon";
import {
  sendMagicLinkAction,
  signInWithGoogleAction,
  type AuthActionState,
} from "@/features/auth/actions";

const initialState: AuthActionState = { kind: "idle", message: "" };

function Feedback({ state }: { state: AuthActionState }) {
  if (state.kind === "idle" || !state.message) return null;

  return (
    <p
      role={state.kind === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${
        state.kind === "error"
          ? "border-danger/30 bg-danger/5 text-danger"
          : "border-success/30 bg-success/5 text-success"
      }`}
    >
      {state.message}
    </p>
  );
}

export function SignInForm({
  nextPath,
  configured,
  initialError,
}: {
  nextPath: string;
  configured: boolean;
  initialError?: string;
}) {
  const [emailState, emailAction, emailPending] = useActionState(sendMagicLinkAction, initialState);
  const [googleState, googleAction, googlePending] = useActionState(signInWithGoogleAction, initialState);

  return (
    <div className="mx-auto w-full max-w-md">
      {initialError && (
        <div className="mb-5 rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm leading-6 text-danger" role="alert">
          {initialError === "configuration"
            ? "Supabase isn't configured for this environment yet."
            : "That sign-in link is invalid or has expired. Request a fresh one."}
        </div>
      )}

      {!configured && (
        <div className="mb-5 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm leading-6 text-foreground" role="status">
          Add the Supabase project URL and publishable key to <code>.env.local</code>, then restart the dev server. See <code>docs/AUTH_SETUP.md</code> for the steps.
        </div>
      )}

      <form action={emailAction} className="space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        <label className="block text-sm font-semibold text-foreground" htmlFor="email">
          Email address
        </label>
        <input
          autoComplete="email"
          className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted focus:border-primary"
          disabled={!configured || emailPending}
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        <button
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!configured || emailPending}
          type="submit"
        >
          {emailPending ? "Sending link…" : "Continue with email"}
        </button>
        <Feedback state={emailState} />
      </form>

      <div className="my-6 flex items-center gap-4 text-xs font-medium text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={googleAction}>
        <input type="hidden" name="next" value={nextPath} />
        <button
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:bg-secondary-surface disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!configured || googlePending}
          type="submit"
        >
          <Icon name="user" className="size-4" />
          {googlePending ? "Connecting to Google…" : "Continue with Google"}
        </button>
        <Feedback state={googleState} />
      </form>

      <p className="mt-6 text-center text-xs leading-5 text-muted">
        Continuing means you agree to use DropIn respectfully. Safety and account controls will be added with the core activity flows.
      </p>
    </div>
  );
}
