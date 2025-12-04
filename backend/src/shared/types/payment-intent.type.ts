export type PaymentIntentType = {
  paymentIntentId: string;
  clientSecret: string | null;
  status: string;
  amount: number;
  currency: string;
  description?: string;
};
