export type PaymentStatusType = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createAt: Date;
  updatedAt?: Date;
};
