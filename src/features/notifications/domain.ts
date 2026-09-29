export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailSendResult {
  providerMessageId: string;
}

export interface EmailAdapter {
  send(message: EmailMessage, idempotencyKey: string): Promise<EmailSendResult>;
}
