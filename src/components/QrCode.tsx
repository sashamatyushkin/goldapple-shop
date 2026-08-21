// Детерминированный QR-подобный код из строки (демо-визуал карты лояльности).
// Для продакшена замените на реальный QR (напр. библиотека qrcode) с подписанным токеном.

function hashModules(seed: string, size = 21): boolean[] {
  const cells: boolean[] = [];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let i = 0; i < size * size; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    cells.push((h & 1) === 1);
  }
  return cells;
}

export function QrCode({ value, className = "" }: { value: string; className?: string }) {
  const size = 21;
  const cells = hashModules(value, size);
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#fff" />
      {cells.map((on, i) => {
        const x = i % size;
        const y = Math.floor(i / size);
        if (finder(x, y)) return null;
        return on ? <rect key={i} x={x} y={y} width={1} height={1} fill="#0A0A0A" /> : null;
      })}
      {/* три «глаза» QR */}
      {[
        [0, 0],
        [size - 7, 0],
        [0, size - 7],
      ].map(([fx, fy], k) => (
        <g key={k}>
          <rect x={fx} y={fy} width={7} height={7} fill="#0A0A0A" />
          <rect x={fx + 1} y={fy + 1} width={5} height={5} fill="#fff" />
          <rect x={fx + 2} y={fy + 2} width={3} height={3} fill="#0A0A0A" />
        </g>
      ))}
    </svg>
  );
}
