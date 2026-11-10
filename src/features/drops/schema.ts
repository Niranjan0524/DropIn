import { z } from "zod";

export const dropCategories = [
  "gaming",
  "technology",
  "learning",
  "sports",
  "social",
  "discussions",
  "entertainment",
  "lifestyle",
  "other",
] as const;

const numberField = (minimum: number, maximum: number) =>
  z.preprocess((value) => (typeof value === "string" && value.trim() ? Number(value) : value),
    z.number().int().min(minimum).max(maximum));

export const createDropSchema = z.object({
  title: z.string().trim().min(3, "Use at least 3 characters.").max(100, "Use 100 characters or fewer."),
  description: z.string().trim().min(1, "Add a short description.").max(1000, "Use 1,000 characters or fewer."),
  category: z.enum(dropCategories),
  maxParticipants: numberField(2, 20),
  durationMinutes: numberField(15, 240),
  startsAt: z.string().trim().refine(
    (value) => value === "" || !Number.isNaN(Date.parse(value)),
    "Choose a valid start time.",
  ),
  visibility: z.enum(["public", "private"]),
});

export type CreateDropActionState = {
  message: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof createDropSchema>, string>>;
};

export const initialCreateDropState: CreateDropActionState = { message: "" };
