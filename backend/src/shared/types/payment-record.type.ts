export type PaymentRecordType = {
  id: string;                       // Internal DB id
  stripePaymentIntentId: string;    // pi_xxx
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  description?: string;
  createAt: Date;
  updatedAt: Date;
};
