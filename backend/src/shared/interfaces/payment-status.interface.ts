export interface IPaymentStatus {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createAt: Date;
  updatedAt?: Date;
}
