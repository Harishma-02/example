export interface IPaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string | null;
  status: string;
  amount: number;
  currency: string;
  description?: string;
}
