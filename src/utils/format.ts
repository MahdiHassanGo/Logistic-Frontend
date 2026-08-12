export const money = (value: unknown) => new Intl.NumberFormat('bn-BD', { style:'currency', currency:'BDT', maximumFractionDigits:2 }).format(Number(value ?? 0));
export const numberBn = (value: unknown) => new Intl.NumberFormat('bn-BD').format(Number(value ?? 0));
export const dateBn = (value?: string | null) => value ? new Intl.DateTimeFormat('bn-BD', { dateStyle:'medium' }).format(new Date(value)) : '—';
export const dateTimeBn = (value?: string | null) => value ? new Intl.DateTimeFormat('bn-BD', { dateStyle:'medium', timeStyle:'short' }).format(new Date(value)) : '—';
export const toIso = (value?: string) => value ? new Date(value).toISOString() : undefined;
export const normalizeMoney = (value: string | number | undefined) => {
  const n = Number(value ?? 0); return Number.isFinite(n) && n >= 0 ? n.toFixed(2) : '0.00';
};
export const idempotencyKey = () => crypto.randomUUID();
