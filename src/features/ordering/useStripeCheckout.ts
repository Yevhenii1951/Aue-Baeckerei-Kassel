"use client";

import { useState } from "react";
import { startStripeCheckoutAction } from "@/features/payments/paymentActions";
import type { CheckoutFormValues } from "./checkout-form";

type UseStripeCheckoutArgs = {
  cart: { productId: string; quantity: number }[];
  locale: string;
  returnPath: string;
};

export function useStripeCheckout({ cart, locale, returnPath }: UseStripeCheckoutArgs) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function payWithStripe(customer: CheckoutFormValues): Promise<boolean> {
    setPending(true);
    setError(null);

    try {
      const result = await startStripeCheckoutAction({ cart, customer, locale, returnPath });

      if (!result.ok) {
        setError(result.message);
        return false;
      }

      window.location.href = result.checkoutUrl;
      return true;
    } catch {
      setError("Der Bezahlvorgang konnte nicht gestartet werden.");
      return false;
    } finally {
      setPending(false);
    }
  }

  return { payWithStripe, pending, error };
}
