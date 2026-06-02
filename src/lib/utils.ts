export function formatBaht(value: number): string {
  return `${value.toLocaleString("th-TH")} บาท`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("th-TH");
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatThaiDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatThaiDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH", {
    month: "short",
    day: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  return timeStr;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
