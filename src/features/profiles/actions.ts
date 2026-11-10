"use server";

import { redirect } from "next/navigation";
import { profileSchema } from "@/features/profiles/schema";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  message: string;
  fieldErrors?: Partial<Record<"username" | "displayName" | "bio" | "interests", string>>;
};

export async function saveProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    bio: formData.get("bio"),
    visibility: formData.get("visibility"),
    interests: formData.get("interests"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      message: "Check the highlighted fields and try again.",
      fieldErrors: {
        username: fieldErrors.username?.[0],
        displayName: fieldErrors.displayName?.[0],
        bio: fieldErrors.bio?.[0],
        interests: fieldErrors.interests?.[0],
      },
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { message: "Supabase is not configured yet. Set the project URL and key in .env.local." };
  }

  const { data: claims, error: claimsError } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (claimsError || !userId) redirect("/sign-in?next=%2Fprofile%2Fsetup");

  const { error } = await supabase.rpc("save_my_profile", {
    p_username: parsed.data.username,
    p_display_name: parsed.data.displayName,
    p_bio: parsed.data.bio || null,
    p_visibility: parsed.data.visibility,
    p_interests: parsed.data.interests,
  });

  if (error?.code === "23505") {
    return { message: "That username is already in use. Try another one." };
  }
  if (error?.code === "22023") {
    return { message: "Some profile details are outside the allowed limits. Please review them." };
  }
  if (error) {
    return { message: "We couldn't save your profile. Please try again." };
  }

  redirect("/profile");
}
