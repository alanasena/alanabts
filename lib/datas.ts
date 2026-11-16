// Datas sempre no horário local (sem pular dia por causa do fuso)

export function paraISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function deISO(s: string): Date {
  const [a, m, d] = s.split("-").map(Number);
  return new Date(a, m - 1, d);
}

export const hojeISO = () => paraISO(new Date());

export function somarDias(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// semana começando na segunda
export function inicioDaSemana(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dia = (r.getDay() + 6) % 7;
  return somarDias(r, -dia);
}

export function diasAte(iso: string): number {
  const hoje = deISO(hojeISO());
  return Math.round((deISO(iso).getTime() - hoje.getTime()) / 86400000);
}

export function textoFaltam(iso: string): string {
  const n = diasAte(iso);
  if (n === 0) return "é HOJE!";
  if (n === 1) return "falta 1 dia";
  if (n > 1) return `faltam ${n} dias`;
  return n === -1 ? "foi ontem" : `foi há ${-n} dias`;
}

export const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
export const DIAS_SEMANA = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

export function dataBonita(iso: string): string {
  return deISO(iso).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
}
