export const load = <T,>(k: string, f: T): T => {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) as T : f; } catch { return f; }
};
export const save = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));
