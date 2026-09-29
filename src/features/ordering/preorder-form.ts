import { z } from "zod";

export const preorderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "invalid_name")
    .max(80, "name_too_long"),
  email: z
    .string()
    .trim()
    .email("invalid_email")
    .max(120, "email_too_long"),
  phone: z
    .string()
    .trim()
    .regex(
      /^[+0-9][0-9 /()-]{4,19}$/,
      "invalid_phone",
    ),
  notes: z
    .string()
    .trim()
    .max(500, "notes_too_long")
    .optional()
    .default(""),
});

export type PreorderFormValues = z.infer<typeof preorderFormSchema>;

export type PreorderFormResult =
  | { success: true; data: PreorderFormValues; fieldErrors: Record<string, string> }
  | { success: false; fieldErrors: Record<string, string> };

export function parsePreorderForm(input: unknown): PreorderFormResult {
  const result = preorderFormSchema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data, fieldErrors: {} };
  }

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    if (typeof issue.path[0] === "string" && !fieldErrors[issue.path[0]]) {
      fieldErrors[issue.path[0]] = issue.message;
    }
  }

  return { success: false, fieldErrors };
}