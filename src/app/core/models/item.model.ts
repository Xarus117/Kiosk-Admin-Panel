export interface Item {
  id?: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  available: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
