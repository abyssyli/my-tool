const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isISODateString(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map((x) => Number(x));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

export function parseISODateToLocalDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map((x) => Number(x));
  return new Date(y, m - 1, d);
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return formatISODate(new Date());
}

export function addDaysISO(isoDate: string, days: number): string {
  const dt = parseISODateToLocalDate(isoDate);
  dt.setDate(dt.getDate() + days);
  return formatISODate(dt);
}

export function compareISODate(a: string, b: string): -1 | 0 | 1 {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function formatDisplayDate(isoDate: string): string {
  const dt = parseISODateToLocalDate(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dt);
}

export function weekStartISO(isoDate: string, weekStartsOn: 0 | 1 = 1): string {
  const dt = parseISODateToLocalDate(isoDate);
  const day = dt.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  dt.setDate(dt.getDate() - diff);
  return formatISODate(dt);
}

export function timeToMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hh = Number(match[1]);
  const mm = Number(match[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23) return null;
  if (mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}
