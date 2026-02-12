export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

export interface Transaction {
  id?: number;
  orderId: number;
  orderNumber?: string;
  amount: number;
  method: PaymentMethod | string;
  status: PaymentStatus | string;
  createdAt?: string;
}

export interface ProcessPaymentRequest {
  orderId: number;
  amount: number;
  method: PaymentMethod | string;
}
