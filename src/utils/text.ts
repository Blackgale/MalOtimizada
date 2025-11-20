export function limit(text: string, n = 100) {
  if (!text) return "";
  return text.length <= n ? text : text.slice(0, n - 1).trimEnd() + "…";
}
