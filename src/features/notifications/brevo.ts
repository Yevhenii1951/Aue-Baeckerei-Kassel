import "server-only";
import type { EmailAdapter } from "./domain";

export function createBrevoAdapter(
  apiKey: string,
  sender: { name: string; address: string },
): EmailAdapter {
  return {
    async send(message, idempotencyKey) {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          "idempotency-key": idempotencyKey,
        },
        body: JSON.stringify({
          sender: { name: sender.name, email: sender.address },
          to: [{ email: message.to }],
          subject: message.subject,
          htmlContent: message.html,
          textContent: message.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Brevo delivery failed");
      }

      const body: unknown = await response.json();
      if (
        !body ||
        typeof body !== "object" ||
        !("messageId" in body) ||
        typeof body.messageId !== "string"
      ) {
        throw new Error("Brevo response invalid");
      }

      return { providerMessageId: body.messageId };
    },
  };
}

export function brevoSenderFromEnv(
  name: string | undefined,
  address: string | undefined,
): { name: string; address: string } | null {
  if (!name || !address) return null;

  return { name, address };
}
