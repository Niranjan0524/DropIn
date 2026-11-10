"use client";

import { cancelDropAction } from "@/features/drops/actions";

export function CancelDropButton({ dropId }: { dropId: string }) {
  return (
    <form action={cancelDropAction} onSubmit={(event) => {
      if (!window.confirm("Cancel this Drop? Members will no longer be able to join.")) event.preventDefault();
    }}>
      <input name="dropId" type="hidden" value={dropId} />
      <button className="inline-flex min-h-10 items-center rounded-full border border-danger/30 px-4 text-xs font-semibold text-danger transition hover:bg-danger/5" type="submit">
        Cancel Drop
      </button>
    </form>
  );
}
