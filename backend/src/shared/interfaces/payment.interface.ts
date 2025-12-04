export interface IPayment {
  id: string;                     
  stripePaymentIntentId: string;  
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  description?: string;
  createAt: Date;
  updatedAt: Date;
}
