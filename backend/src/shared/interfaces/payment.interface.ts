export interface IPayment {
  id: string;                     // internal db id
  stripePaymentIntentId: string;  // pi_xxx
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  description?: string;
  createAt: Date;
  updatedAt: Date;
}
