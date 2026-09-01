/** Pure mapping: one scroll progress 0–1 → continuous rice biology. No React. */

export type GrowthState = {
  seedSplit: number;
  rootMain: number;
  rootBranch1: number;
  rootBranch2: number;
  rootHairs: number;
  coleoptile: number;
  stem: number;
  leaf: readonly [number, number, number, number, number, number];
  leafFold: readonly [number, number, number, number, number, number];
  rachis: number;
  panicleBranches: number;
  grains: number;
  grainFill: number;
  gold: number;
  bend: number;
  wind: number;
  product: number;
  field: number;
  zoom: number;
  focusX: number;
  focusY: number;
};

export const BIO_EDGES = [0.1, 0.22, 0.35, 0.48, 0.76, 0.88] as const;
export const BIO_HYSTERESIS = 0.02;

const LAST = 6;

export function clamp01(n: number): number {
  if (n <= 0) return 0;
  if (n >= 1) return 1;
  return n;
}

export function remap(p: number, a: number, b: number): number {
  if (b <= a) return p >= b ? 1 : 0;
  return clamp01((p - a) / (b - a));
}

export function smooth(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
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

function leafGrowth(p: number, start: number, end: number): { grow: number; fold: number } {
  const grow = smooth(remap(p, start, end));
  const fold = lerp(-18, 0, smooth(remap(p, start, start + (end - start) * 0.7)));
  return { grow, fold };
}

export function computeGrowth(p: number): GrowthState {
  const x = clamp01(p);

  const l0 = leafGrowth(x, 0.34, 0.46);
  const l1 = leafGrowth(x, 0.42, 0.54);
  const l2 = leafGrowth(x, 0.5, 0.62);
  const l3 = leafGrowth(x, 0.56, 0.68);
  const l4 = leafGrowth(x, 0.62, 0.74);
  const l5 = leafGrowth(x, 0.68, 0.78);

  const camT = smooth(x);
  const zoom = lerp(2.62, 0.94, camT);
  const focusY = lerp(404, 268, camT);
  const focusX = lerp(480, 478, camT);

  return {
    seedSplit: smooth(remap(x, 0.1, 0.2)),
    rootMain: smooth(remap(x, 0.12, 0.3)),
    rootBranch1: smooth(remap(x, 0.2, 0.36)),
    rootBranch2: smooth(remap(x, 0.26, 0.42)),
    rootHairs: smooth(remap(x, 0.3, 0.46)),
    coleoptile: smooth(remap(x, 0.2, 0.34)),
    stem: smooth(remap(x, 0.28, 0.76)),
    leaf: [l0.grow, l1.grow, l2.grow, l3.grow, l4.grow, l5.grow],
    leafFold: [l0.fold, l1.fold, l2.fold, l3.fold, l4.fold, l5.fold],
    rachis: smooth(remap(x, 0.74, 0.84)),
    panicleBranches: smooth(remap(x, 0.78, 0.88)),
    grains: smooth(remap(x, 0.82, 0.93)),
    grainFill: smooth(remap(x, 0.86, 0.97)),
    gold: smooth(remap(x, 0.86, 0.99)),
    bend: smooth(remap(x, 0.9, 1)),
    wind: smooth(remap(x, 0.5, 0.72)),
    product: smooth(remap(x, 0.96, 1)),
    field: smooth(remap(x, 0.58, 0.78)),
    zoom,
    focusX,
    focusY,
  };
}

export function snapshotForStage(index: number): number {
  const mids = [0.05, 0.16, 0.28, 0.41, 0.62, 0.82, 0.97];
  return mids[Math.max(0, Math.min(LAST, index))] ?? 0.05;
}
