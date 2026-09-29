"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { startStripeCheckoutAction } from "@/features/payments/paymentActions";
import type { CheckoutFormValues } from "./checkout-form";

type UseStripeCheckoutArgs = {
  cart: { productId: string; quantity: number }[];
  locale: string;
  returnPath: string;
};

const VALIDATION_KEY_FOR_CODE: Record<string, string> = {
  INVALID_INPUT: "order_invalid_input",
  ORDER_FAILED: "checkout_failed",
};

export function useStripeCheckout({ cart, locale, returnPath }: UseStripeCheckoutArgs) {
  const tval = useTranslations("validation");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function payWithStripe(customer: CheckoutFormValues): Promise<boolean> {
    setPending(true);
    setError(null);

    try {
      const result = await startStripeCheckoutAction({ cart, customer, locale, returnPath });

      if (!result.ok) {
        const key = VALIDATION_KEY_FOR_CODE[result.code] ?? result.code.toLowerCase();
        setError(tval(key));
        return false;
      }

      window.location.href = result.checkoutUrl;
      return true;
    } catch {
      setError(tval("checkout_failed"));
      return false;
    } finally {
      setPending(false);
    }
  }

  return { payWithStripe, pending, error };
}