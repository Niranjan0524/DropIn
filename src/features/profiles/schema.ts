import { z } from "zod";

const interestsSchema = z.string().transform((raw, context) => {
  const interests = [...new Set(raw.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean))];
  if (interests.length > 10) {
    context.addIssue({ code: "custom", message: "Choose no more than 10 interests." });
    return z.NEVER;
  }
  if (interests.some((interest) => interest.length > 40)) {
    context.addIssue({ code: "custom", message: "Each interest must be 40 characters or less." });
    return z.NEVER;
  }
  return interests;
});

export const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,24}$/, "Use 3–24 lowercase letters, numbers, or underscores."),
  displayName: z.string().trim().min(1, "Add a display name.").max(60, "Use 60 characters or fewer."),
  bio: z.string().trim().max(160, "Use 160 characters or fewer."),
  visibility: z.enum(["public", "private"]),
  interests: interestsSchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
