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

export const PRODUCTS: Product[] = [
  { id: "p1", brand: "Lancôme", name: "La Vie Est Belle, парфюмерная вода", category: "parfum", price: 9890, oldPrice: 12400, volume: "50 мл", rating: 4.9, hit: true, tone: ["#FBEAF0", "#F3CDDC"], shape: "perfume", cap: "#D9B25A", body: "#F4C0D3" },
  { id: "p2", brand: "Dior", name: "Sauvage, туалетная вода", category: "parfum", price: 11200, volume: "60 мл", rating: 4.9, hit: true, tone: ["#E6F0F7", "#C4DAEB"], shape: "perfume", cap: "#8E9AA6", body: "#8FB0CC" },
  { id: "p3", brand: "La Mer", name: "Crème de la Mer, крем для лица", category: "skincare", price: 24500, oldPrice: 28900, volume: "30 мл", rating: 4.8, isNew: true, tone: ["#E7F2EC", "#C7E0D2"], shape: "jar", cap: "#5E9E8C", body: "#F3F8F5" },
  { id: "p4", brand: "The Ordinary", name: "Niacinamide 10% + Zinc 1%", category: "skincare", price: 990, volume: "30 мл", rating: 4.7, hit: true, tone: ["#F4F2EC", "#E1DDD1"], shape: "dropper", cap: "#2B2B2B", body: "#F0ECE2" },
  { id: "p5", brand: "Charlotte Tilbury", name: "Pillow Talk, помада", category: "makeup", price: 3450, oldPrice: 3990, volume: "3.5 г", rating: 4.9, hit: true, tone: ["#F7DDD6", "#EFC0B4"], shape: "lipstick", cap: "#C56B54", body: "#C2607E" },
  { id: "p6", brand: "Rare Beauty", name: "Soft Pinch, жидкие румяна", category: "makeup", price: 2790, volume: "7.5 мл", rating: 4.8, isNew: true, tone: ["#FBE4EA", "#F3C3D0"], shape: "dropper", cap: "#E58AA2", body: "#F6D3DC" },
  { id: "p7", brand: "Olaplex", name: "No.3 Hair Perfector", category: "hair", price: 2650, oldPrice: 3100, volume: "100 мл", rating: 4.8, tone: ["#F6ECE0", "#E8D2BB"], shape: "pump", cap: "#EDEDED", body: "#F3E7D8" },
  { id: "p8", brand: "Kérastase", name: "Nutritive, маска для волос", category: "hair", price: 4180, volume: "200 мл", rating: 4.7, tone: ["#EFE6F6", "#D6C2E8"], shape: "jar", cap: "#8E6BB8", body: "#F1EAF7" },
  { id: "p9", brand: "YSL", name: "Black Opium, парфюмерная вода", category: "parfum", price: 10500, oldPrice: 13200, volume: "50 мл", rating: 4.9, hit: true, tone: ["#E7DEEE", "#C7B4D8"], shape: "perfume", cap: "#151515", body: "#4A3D5C" },
  { id: "p10", brand: "Estée Lauder", name: "Advanced Night Repair, сыворотка", category: "skincare", price: 8990, volume: "50 мл", rating: 4.8, hit: true, tone: ["#F1E4D2", "#DDC29E"], shape: "dropper", cap: "#5B3C22", body: "#B87A3E" },
  { id: "p11", brand: "Dyson", name: "Airwrap, мультистайлер", category: "hair", price: 49900, oldPrice: 54900, rating: 4.9, isNew: true, tone: ["#F3D9E4", "#DEA9C4"], shape: "tool", cap: "#C77FA6", body: "#E9E2E6" },
  { id: "p12", brand: "Sol de Janeiro", name: "Brazilian Bum Bum, крем", category: "skincare", price: 3290, volume: "240 мл", rating: 4.8, hit: true, tone: ["#FBEFD6", "#F1D59B"], shape: "jar", cap: "#E8B84B", body: "#F6E9CE" },
];

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
