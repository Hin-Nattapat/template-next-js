// pageWindow returns page numbers to render, with -1 sentinels for ellipses.
export function pageWindow(page: number, last: number): number[] {
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }
  const out: number[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(last - 1, page + 1);
  if (start > 2) {
    out.push(-1);
  }
  for (let p = start; p <= end; p++) {
    out.push(p);
  }
  if (end < last - 1) {
    out.push(-1);
  }
  out.push(last);
  return out;
}
