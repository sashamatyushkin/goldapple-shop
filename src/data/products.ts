// Топ-товары витрины (статичный каталог для MVP).
// image — плейсхолдер-градиент (tone), чтобы приложение было самодостаточным без внешних картинок.

export type Shape = "perfume" | "jar" | "dropper" | "lipstick" | "pump" | "tool";

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
  tone: [string, string]; // градиент фона packshot
  shape: Shape; // тип упаковки для векторного packshot
  cap: string; // цвет крышки/акцента
  body: string; // цвет корпуса/жидкости
}

export type Category = "parfum" | "skincare" | "makeup" | "hair";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "parfum", label: "парфюм" },
  { id: "skincare", label: "уход" },
  { id: "makeup", label: "макияж" },
  { id: "hair", label: "волосы" },
];

// Реальные товары и hi-res фото с goldapple.ru (public/products/<id>.webp).
export const PRODUCTS: Product[] = [
  { id: "p1", brand: "Versace", name: "Bright Crystal, туалетная вода", category: "parfum", price: 8990, oldPrice: 11200, volume: "90 мл", rating: 4.9, hit: true, tone: ["#F7EEF1", "#ECDEE4"], shape: "perfume", cap: "#C9A24B", body: "#EBB9C8" },
  { id: "p2", brand: "Dolce & Gabbana", name: "L’Imperatrice, туалетная вода", category: "parfum", price: 9490, volume: "50 мл", rating: 4.9, hit: true, tone: ["#F0F3EE", "#E1E7DC"], shape: "perfume", cap: "#8E9AA6", body: "#AEC59B" },
  { id: "p3", brand: "CU", name: "Clean-up, увлажняющий крем для лица", category: "skincare", price: 1690, volume: "50 мл", rating: 4.7, isNew: true, tone: ["#EEF3F5", "#DEE8EC"], shape: "jar", cap: "#7FB0C4", body: "#EAF3F6" },
  { id: "p4", brand: "Le Mousse", name: "Seboregulating, крем для лица", category: "skincare", price: 2290, volume: "50 мл", rating: 4.8, tone: ["#F4F1EC", "#E7E1D6"], shape: "jar", cap: "#C7B79A", body: "#F3EEE6" },
  { id: "p5", brand: "Estée Lauder", name: "Double Wear, матовый консилер", category: "makeup", price: 3290, oldPrice: 3790, volume: "12 мл", rating: 4.9, hit: true, tone: ["#F5EFE7", "#E7DCCB"], shape: "dropper", cap: "#5B3C22", body: "#D9B88E" },
  { id: "p6", brand: "Darling", name: "Lash Hug, термотушь для ресниц", category: "makeup", price: 1290, volume: "8.5 г", rating: 4.8, isNew: true, tone: ["#F3EFF3", "#E4DCE6"], shape: "lipstick", cap: "#2B2B2B", body: "#6E5A86" },
  { id: "p7", brand: "Riche", name: "Масло для волос Biotech Lipids", category: "hair", price: 2490, oldPrice: 2990, volume: "30 мл", rating: 4.8, hit: true, tone: ["#F6F1E9", "#E9DECB"], shape: "dropper", cap: "#5B3C22", body: "#C79A5A" },
  { id: "p8", brand: "Davroe", name: "Smooth Senses, разглаживающий шампунь", category: "hair", price: 2790, volume: "325 мл", rating: 4.7, tone: ["#EEF2F1", "#DCE6E3"], shape: "pump", cap: "#D8DEDB", body: "#EAF0EE" },
];

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
