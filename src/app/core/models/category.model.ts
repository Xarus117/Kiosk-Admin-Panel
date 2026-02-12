export interface Category {
  id?: number;
  name: string;
  description?: string;
  active: boolean;
  parentId?: number;
  parentName?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}
