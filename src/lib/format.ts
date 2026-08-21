export function formatPrice(value: number): string {
  return value.toLocaleString("ru-RU").replace(/,/g, " ") + " ₽";
}

export function formatNumber(value: number): string {
  return value.toLocaleString("ru-RU").replace(/,/g, " ");
}
