/** Pure mapping: scroll progress 0–1 → timeline stage index. No React. */

export const BIO_EDGES = [0.1, 0.22, 0.35, 0.48, 0.76, 0.88] as const;
export const BIO_HYSTERESIS = 0.02;

const LAST = 6;

export function clamp01(n: number): number {
  if (n <= 0) return 0;
  if (n >= 1) return 1;
  return n;
}

export function stageFromProgress(p: number, current: number): number {
  const x = clamp01(p);
  if (current < LAST && x > BIO_EDGES[current] + BIO_HYSTERESIS) return current + 1;
  if (current > 0 && x < BIO_EDGES[current - 1] - BIO_HYSTERESIS) return current - 1;
  return current;
}

export function stageIndexAt(p: number): number {
  const x = clamp01(p);
  for (let i = 0; i < BIO_EDGES.length; i++) {
    if (x < BIO_EDGES[i]) return i;
  }
  return LAST;
}
