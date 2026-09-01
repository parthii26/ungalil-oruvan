/** Shared motion tokens. Sophisticated, not mechanical. */

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.45, 0, 0.55, 1] as const;
export const easeNatural = easeOut;

export const duration = {
  /** Level 1 — buttons, hover, cart */
  micro: 0.2,
  /** Level 2 — image reveals, type, cards, nav */
  section: 0.6,
  standard: 0.38,
  /** Level 3 — seed, field, harvest, morph */
  cinematic: 1.4,
  story: 0.8,
  ambient: 8,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.section, ease: easeOut } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.section, ease: easeOut } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 1.04 },
  show: { opacity: 1, scale: 1, transition: { duration: duration.story, ease: easeOut } },
};

export const hoverLift = { y: -2, transition: { duration: duration.micro } };
export const pressDown = { scale: 0.98, transition: { duration: 0.12 } };
