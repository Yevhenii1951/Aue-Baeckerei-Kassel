import { z } from "zod";

export const PaymentMethodId = [
  "stripe",
  "paypal",
  "klarna",
  "bar",
  "rechnung",
] as const;

export type PaymentMethodId = (typeof PaymentMethodId)[number];

export const PAYMENT_METHODS: { id: PaymentMethodId }[] = [
  { id: "stripe" },
  { id: "paypal" },
  { id: "klarna" },
  { id: "bar" },
  { id: "rechnung" },
];

export type FulfillmentMode = "pickup" | "delivery";

const baseSchema = z.object({
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
    .regex(/^[+0-9][0-9 /()-]{4,19}$/, "invalid_phone"),
  mode: z.enum(["pickup", "delivery"], {
    errorMap: () => ({ message: "choose_mode" }),
  }),
  deliveryDate: z.string().optional().default(""),
  deliverySlotId: z.string().optional().default(""),
  express: z.boolean().optional().default(false),
  payment: z.enum(PaymentMethodId, {
    errorMap: () => ({ message: "choose_payment" }),
  }),
  street: z
    .string()
    .trim()
    .max(120, "street_too_long")
    .optional()
    .default(""),
  zip: z.string().trim().optional().default(""),
  city: z
    .string()
    .trim()
    .max(80, "city_too_long")
    .optional()
    .default(""),
  notes: z
    .string()
    .trim()
    .max(500, "notes_too_long")
    .optional()
    .default(""),
});

export const checkoutFormSchema = baseSchema.superRefine((data, context) => {
  if (data.mode === "delivery") {
    if (!data.street) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["street"],
        message: "street_required",
      });
    }
    if (!data.zip || !/^[0-9]{5}$/.test(data.zip)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["zip"],
        message: "zip_invalid",
      });
    }
    if (!data.city) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["city"],
        message: "city_required",
      });
    }
    if (!data.deliveryDate || !data.deliverySlotId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deliverySlotId"],
        message: "choose_slot",
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