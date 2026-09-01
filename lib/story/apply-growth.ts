import type { GrowthState } from "./growth-progress";

type PlantBindings = {
  svg: SVGSVGElement;
  cam: SVGGElement | null;
  draws: Map<string, SVGGeometryElement[]>;
  leaves: SVGElement[];
  leafRest: number[];
  grains: SVGElement | null;
  panicle: SVGElement | null;
  fields: SVGElement[];
  split: SVGElement | null;
  seed: SVGElement | null;
};

export function bindPlant(svg: SVGSVGElement): (state: GrowthState) => void {
  const draws = new Map<string, SVGGeometryElement[]>();
  svg.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach((el) => {
    const key = el.dataset.draw;
    if (!key) return;
    const list = draws.get(key) ?? [];
    list.push(el);
    draws.set(key, list);
  });

  const leaves = Array.from(svg.querySelectorAll<SVGElement>("[data-leaf]"));
  const bound: PlantBindings = {
    svg,
    cam: svg.querySelector("[data-cam]"),
    draws,
    leaves,
    leafRest: leaves.map((el) => Number(el.dataset.rest ?? 0)),
    grains: svg.querySelector("[data-grains]"),
    panicle: svg.querySelector("[data-panicle]"),
    fields: Array.from(svg.querySelectorAll<SVGElement>("[data-field]")),
    split: svg.querySelector("[data-split]"),
    seed: svg.querySelector("[data-seed]"),
  };

  return (state) => applyBound(bound, state);
}

function setDraw(list: SVGGeometryElement[] | undefined, amount: number) {
  if (!list) return;
  const offset = String(1 - amount);
  for (const el of list) el.style.strokeDashoffset = offset;
}

function applyBound(b: PlantBindings, state: GrowthState) {
  b.svg.style.setProperty("--gold", state.gold.toFixed(3));
  b.svg.style.setProperty("--wind", state.wind.toFixed(3));
  b.svg.dataset.wind = state.wind > 0.45 ? "1" : "0";

  if (b.cam) {
    b.cam.setAttribute(
      "transform",
      `translate(480 270) scale(${state.zoom.toFixed(4)}) translate(${(-state.focusX).toFixed(2)} ${(-state.focusY).toFixed(2)})`,
    );
  }

  setDraw(b.draws.get("rootMain"), state.rootMain);
  setDraw(b.draws.get("rootBranch1"), state.rootBranch1);
  setDraw(b.draws.get("rootBranch2"), state.rootBranch2);
  setDraw(b.draws.get("rootHairs"), state.rootHairs);
  setDraw(b.draws.get("coleoptile"), state.coleoptile);
  setDraw(b.draws.get("stem"), state.stem);
  setDraw(b.draws.get("rachis"), state.rachis);
  setDraw(b.draws.get("panicle"), state.panicleBranches);

  const leafAmt = state.leaf as readonly number[];
  const leafFold = state.leafFold as readonly number[];
  for (let i = 0; i < b.leaves.length; i++) {
    const grow = leafAmt[i] ?? 0;
    const fold = leafFold[i] ?? 0;
    const rest = b.leafRest[i] ?? 0;
    const el = b.leaves[i];
    el.style.transform = `rotate(${(rest + fold).toFixed(2)}deg) scale(${Math.max(0.04, grow).toFixed(4)})`;
    el.style.opacity = grow < 0.025 ? "0" : Math.min(1, grow * 2.8).toFixed(3);
  }

  if (b.grains) {
    const g = state.grains;
    b.grains.style.opacity = g < 0.02 ? "0" : g.toFixed(3);
    const s = 0.32 + 0.68 * state.grainFill;
    b.grains.style.transform = `scale(${s.toFixed(3)})`;
  }

  if (b.panicle) {
    b.panicle.style.transform = `rotate(${(state.bend * 7.5).toFixed(2)}deg)`;
  }

  const field = state.field;
  for (const el of b.fields) {
    el.style.opacity = field < 0.02 ? "0" : (field * 0.42).toFixed(3);
  }

  if (b.split) b.split.style.opacity = (state.seedSplit * 0.7).toFixed(3);

  if (b.seed) {
    const open = state.seedSplit * 2.4;
    b.seed.style.transform = `rotate(${(-16 - open).toFixed(2)}deg)`;
  }
}
