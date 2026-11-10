"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createDropSchema, type CreateDropActionState } from "@/features/drops/schema";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function createDropAction(
  _previousState: CreateDropActionState,
  formData: FormData,
): Promise<CreateDropActionState> {
  const parsed = createDropSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    maxParticipants: formData.get("maxParticipants"),
    durationMinutes: formData.get("durationMinutes"),
    startsAt: formData.get("startsAt"),
    visibility: formData.get("visibility"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      message: "Check the highlighted details and try again.",
      fieldErrors: {
        title: errors.title?.[0],
        description: errors.description?.[0],
        category: errors.category?.[0],
        maxParticipants: errors.maxParticipants?.[0],
        durationMinutes: errors.durationMinutes?.[0],
        startsAt: errors.startsAt?.[0],
        visibility: errors.visibility?.[0],
      },
    };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in?next=%2Fcreate");

  const { data: profile } = await currentUser.supabase
    .from("profiles")
    .select("username")
    .eq("id", currentUser.userId)
    .maybeSingle();

  if (!profile || /^member_[0-9a-f]{17}$/.test(profile.username)) {
    redirect("/profile/setup?next=%2Fcreate");
  }

  const { data: dropId, error } = await currentUser.supabase.rpc("create_drop", {
    p_title: parsed.data.title,
    p_description: parsed.data.description,
    p_category: parsed.data.category,
    p_max_participants: parsed.data.maxParticipants,
    p_duration_minutes: parsed.data.durationMinutes,
    p_starts_at: parsed.data.startsAt || null,
    p_visibility: parsed.data.visibility,
  });

  if (error) {
    if (error.code === "22023") {
      return { message: "That start time or one of the Drop details is outside the allowed limits." };
    }
    if (error.code === "42501") redirect("/profile/setup?next=%2Fcreate");
    return { message: "We couldn't publish this Drop. Please try again." };
  }

  if (typeof dropId !== "string") {
    return { message: "The Drop was saved, but we couldn't open its page. Find it in My Activities." };
  }

  redirect(`/drop/${dropId}?created=1`);
}

const dropIdSchema = z.string().uuid();

export async function cancelDropAction(formData: FormData) {
  const dropId = dropIdSchema.safeParse(formData.get("dropId"));
  if (!dropId.success) redirect("/activities?error=invalid-drop");

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in?next=%2Factivities");

  const { error } = await currentUser.supabase.rpc("cancel_my_drop", {
    p_drop_id: dropId.data,
  });

  if (error) redirect("/activities?error=cancel-failed");
  redirect("/activities?cancelled=1");
}
