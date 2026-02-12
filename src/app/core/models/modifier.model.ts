export type ModifierType = 'SIZE' | 'TEMPERATURE' | 'ADD_ON' | 'SUGAR_LEVEL' | 'ICE_LEVEL' | 'DRINK';

export interface Modifier {
  id?: number;
  name: string;
  type: ModifierType | string;
  price: number;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}
