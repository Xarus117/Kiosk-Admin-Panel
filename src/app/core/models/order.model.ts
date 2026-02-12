export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItemModifier {
  modifierId: number;
  modifierName?: string;
  price: number;
}

export interface OrderItem {
  id?: number;
  itemId: number;
  itemName?: string;
  quantity: number;
  price: number;
  modifiers?: OrderItemModifier[];
}

export interface Order {
  id?: number;
  orderNumber?: string;
  userId?: number;
  username?: string;
  status: OrderStatus | string;
  items: OrderItem[];
  subtotal?: number;
  total: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  userId?: number;
  items: { itemId: number; quantity: number; modifierIds?: number[] }[];
  notes?: string;
}
