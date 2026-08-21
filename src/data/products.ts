// Топ-товары витрины (статичный каталог для MVP).
// image — плейсхолдер-градиент (tone), чтобы приложение было самодостаточным без внешних картинок.

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  volume?: string;
  rating: number;
  hit?: boolean;
  isNew?: boolean;
  tone: [string, string]; // градиент плейсхолдера
}

export type Category = "parfum" | "skincare" | "makeup" | "hair";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "parfum", label: "парфюм" },
  { id: "skincare", label: "уход" },
  { id: "makeup", label: "макияж" },
  { id: "hair", label: "волосы" },
];

export const PRODUCTS: Product[] = [
  { id: "p1", brand: "Lancôme", name: "La Vie Est Belle, парфюмерная вода", category: "parfum", price: 9890, oldPrice: 12400, volume: "50 мл", rating: 4.9, hit: true, tone: ["#F7D9E3", "#E9B7C6"] },
  { id: "p2", brand: "Dior", name: "Sauvage, туалетная вода", category: "parfum", price: 11200, volume: "60 мл", rating: 4.9, hit: true, tone: ["#CDE3F0", "#9FB8CE"] },
  { id: "p3", brand: "La Mer", name: "Crème de la Mer, крем для лица", category: "skincare", price: 24500, oldPrice: 28900, volume: "30 мл", rating: 4.8, isNew: true, tone: ["#DDECE4", "#B7D3C6"] },
  { id: "p4", brand: "The Ordinary", name: "Niacinamide 10% + Zinc 1%", category: "skincare", price: 990, volume: "30 мл", rating: 4.7, hit: true, tone: ["#F0EFEA", "#D8D6CC"] },
  { id: "p5", brand: "Charlotte Tilbury", name: "Pillow Talk, помада", category: "makeup", price: 3450, oldPrice: 3990, volume: "3.5 г", rating: 4.9, hit: true, tone: ["#F3D3CC", "#E3A9A0"] },
  { id: "p6", brand: "Rare Beauty", name: "Soft Pinch, жидкие румяна", category: "makeup", price: 2790, volume: "7.5 мл", rating: 4.8, isNew: true, tone: ["#F6D8DE", "#E7AEBC"] },
  { id: "p7", brand: "Olaplex", name: "No.3 Hair Perfector", category: "hair", price: 2650, oldPrice: 3100, volume: "100 мл", rating: 4.8, tone: ["#F5E7DA", "#E4CBB0"] },
  { id: "p8", brand: "Kérastase", name: "Nutritive, маска для волос", category: "hair", price: 4180, volume: "200 мл", rating: 4.7, tone: ["#E7DCF0", "#C9B4DE"] },
  { id: "p9", brand: "YSL", name: "Black Opium, парфюмерная вода", category: "parfum", price: 10500, oldPrice: 13200, volume: "50 мл", rating: 4.9, hit: true, tone: ["#DcD0E0", "#B49BC4"] },
  { id: "p10", brand: "Estée Lauder", name: "Advanced Night Repair, сыворотка", category: "skincare", price: 8990, volume: "50 мл", rating: 4.8, hit: true, tone: ["#E7D6C4", "#CDB194"] },
  { id: "p11", brand: "Dyson", name: "Airwrap, мультистайлер", category: "hair", price: 49900, oldPrice: 54900, rating: 4.9, isNew: true, tone: ["#E9C6D6", "#CE9DBA"] },
  { id: "p12", brand: "Sol de Janeiro", name: "Brazilian Bum Bum, крем", category: "skincare", price: 3290, volume: "240 мл", rating: 4.8, hit: true, tone: ["#F3DCC7", "#E4BE9C"] },
];

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
