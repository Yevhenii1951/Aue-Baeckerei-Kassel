import { z } from "zod";

export const PaymentMethodId = [
  "stripe",
  "paypal",
  "klarna",
  "bar",
  "rechnung",
] as const;

export type PaymentMethodId = (typeof PaymentMethodId)[number];

export const PAYMENT_METHODS: { id: PaymentMethodId; label: string }[] = [
  { id: "stripe", label: "Kreditkarte (Stripe)" },
  { id: "paypal", label: "PayPal" },
  { id: "klarna", label: "Klarna" },
  { id: "bar", label: "Bar / EC" },
  { id: "rechnung", label: "Rechnung" },
];

export type FulfillmentMode = "pickup" | "delivery";

const baseSchema = z.object({
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
    .regex(/^[+0-9][0-9 /()-]{4,19}$/, "Bitte gib eine gültige Telefonnummer an."),
  mode: z.enum(["pickup", "delivery"], {
    errorMap: () => ({ message: "Bitte wähle Abholung oder Lieferung." }),
  }),
  payment: z.enum(PaymentMethodId, {
    errorMap: () => ({ message: "Bitte wähle eine Zahlungsart." }),
  }),
  street: z
    .string()
    .trim()
    .max(120, "Die Adresse ist zu lang.")
    .optional()
    .default(""),
  zip: z.string().trim().optional().default(""),
  city: z
    .string()
    .trim()
    .max(80, "Der Ort ist zu lang.")
    .optional()
    .default(""),
  notes: z
    .string()
    .trim()
    .max(500, "Die Notiz ist zu lang.")
    .optional()
    .default(""),
});

export const checkoutFormSchema = baseSchema.superRefine((data, context) => {
  if (data.mode === "delivery") {
    if (!data.street) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["street"],
        message: "Bitte gib deine Straße an.",
      });
    }
    if (!data.zip || !/^[0-9]{5}$/.test(data.zip)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["zip"],
        message: "Bitte gib eine gültige PLZ an.",
      });
    }
    if (!data.city) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["city"],
        message: "Bitte gib deinen Ort an.",
      });
    }
  }
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export type CheckoutFormResult =
  | {
      success: true;
      data: CheckoutFormValues;
      fieldErrors: Record<string, string>;
    }
  | { success: false; fieldErrors: Record<string, string> };

export function parseCheckoutForm(input: unknown): CheckoutFormResult {
  const result = checkoutFormSchema.safeParse(input);

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