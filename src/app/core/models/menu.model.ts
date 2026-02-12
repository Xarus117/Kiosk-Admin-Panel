export interface MenuItem {
  itemId: number;
  itemName: string;
  price: number;
  available: boolean;
  categoryId?: number;
  categoryName?: string;
}

export interface MenuConfig {
  itemId: number;
  itemName: string;
  sizes?: { id: number; name: string; price: number }[];
  temperatures?: { id: number; name: string; price: number }[];
  addOns?: { id: number; name: string; price: number }[];
  sugarLevels?: { id: number; name: string; price: number }[];
  iceLevels?: { id: number; name: string; price: number }[];
  drinks?: { id: number; name: string; price: number }[];
}

export interface DrinkOption {
  id: number;
  name: string;
  price: number;
  available: boolean;
}

export interface CalculatePriceRequest {
  itemId: number;
  modifierIds?: number[];
}

export interface CalculatePriceResponse {
  itemId: number;
  itemName: string;
  basePrice: number;
  modifiers: { name: string; price: number }[];
  total: number;
}
