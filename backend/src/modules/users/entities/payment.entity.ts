export class PaymentEntity {
  id: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  createAt: Date;
}
