import { z } from "zod";

export const preorderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Bitte gib deinen Namen an.")
    .max(80, "Der Name ist zu lang."),
  email: z
    .string()
    .trim()
    .email("Bitte gib eine gültige E-Mail-Adresse an.")
    .max(120, "Die E-Mail-Adresse ist zu lang."),
  phone: z
    .string()
    .trim()
    .regex(
      /^[+0-9][0-9 /()-]{4,19}$/,
      "Bitte gib eine gültige Telefonnummer an.",
    ),
  notes: z
    .string()
    .trim()
    .max(500, "Die Notiz ist zu lang.")
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