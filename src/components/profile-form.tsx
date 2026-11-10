"use client";

import { useActionState } from "react";
import { saveProfileAction, type ProfileActionState } from "@/features/profiles/actions";

const initialState: ProfileActionState = { message: "" };
const fieldClass =
  "mt-2 min-h-12 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary";

export function ProfileForm({
  profile,
  interests,
  returnTo = "/profile",
}: {
  profile: { username: string; display_name: string; bio: string | null; visibility: "public" | "private" };
  interests: string[];
  returnTo?: string;
}) {
  const [state, action, pending] = useActionState(saveProfileAction, initialState);

  return (
    <form action={action} className="space-y-5">
      <input name="next" type="hidden" value={returnTo} />
      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="username">Username</label>
        <input className={fieldClass} defaultValue={profile.username} id="username" maxLength={24} minLength={3} name="username" required />
        {state.fieldErrors?.username && <p className="mt-1 text-xs text-danger">{state.fieldErrors.username}</p>}
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="displayName">Display name</label>
        <input className={fieldClass} defaultValue={profile.display_name} id="displayName" maxLength={60} name="displayName" required />
        {state.fieldErrors?.displayName && <p className="mt-1 text-xs text-danger">{state.fieldErrors.displayName}</p>}
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="bio">Short bio <span className="font-normal text-muted">(optional)</span></label>
        <textarea className={`${fieldClass} min-h-24 resize-y`} defaultValue={profile.bio ?? ""} id="bio" maxLength={160} name="bio" rows={3} />
        {state.fieldErrors?.bio && <p className="mt-1 text-xs text-danger">{state.fieldErrors.bio}</p>}
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="interests">Interests <span className="font-normal text-muted">(up to 10, comma-separated)</span></label>
        <input className={fieldClass} defaultValue={interests.join(", ")} id="interests" maxLength={500} name="interests" placeholder="Chess, learning, design" />
        {state.fieldErrors?.interests && <p className="mt-1 text-xs text-danger">{state.fieldErrors.interests}</p>}
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="visibility">Profile visibility</label>
        <select className={fieldClass} defaultValue={profile.visibility} id="visibility" name="visibility">
          <option value="private">Private — only you can view your profile</option>
          <option value="public">Public — signed-in users can view your profile and interests</option>
        </select>
      </div>

      {state.message && (
        <p className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm leading-6 text-danger" role="alert">
          {state.message}
        </p>
      )}

      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-7"
        disabled={pending}
        type="submit"
      >
        {pending ? "Saving profile…" : "Save profile"}
      </button>
    </form>
  );
}
