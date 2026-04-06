export type WeatherKind = "sun" | "cloud" | "rain";

export type WeatherDay = {
  date: string;
  kind: WeatherKind;
  label: string;
  tempMinC: number;
  tempMaxC: number;
};

function hashDate(date: string): number {
  let h = 2166136261;
  for (let i = 0; i < date.length; i += 1) {
    h ^= date.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getPseudoWeather(date: string): WeatherDay {
  const h = hashDate(date);
  const kindRoll = h % 3;
  const kind: WeatherKind = kindRoll === 0 ? "sun" : kindRoll === 1 ? "cloud" : "rain";
  const base = 10 + (h % 9);
  const tempMinC = base - (h % 5);
  const tempMaxC = base + 6 + ((h >>> 3) % 5);

  const label = kind === "sun" ? "Sunny" : kind === "cloud" ? "Cloudy" : "Rain";

  return { date, kind, label, tempMinC, tempMaxC };
}

export function formatTempRange(minC: number, maxC: number): string {
  return `${Math.round(minC)}–${Math.round(maxC)}°C`;
}
