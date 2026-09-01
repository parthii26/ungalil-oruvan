const LEAVES: { x: number; y: number; rest: number; scale: number }[] = [
  { x: 479, y: 348, rest: -56, scale: 0.72 },
  { x: 481, y: 306, rest: 50, scale: 0.9 },
  { x: 478, y: 264, rest: -62, scale: 1.04 },
  { x: 482, y: 222, rest: 54, scale: 1.14 },
  { x: 479, y: 180, rest: -48, scale: 1.2 },
  { x: 481, y: 144, rest: 42, scale: 1.08 },
];

const BLADE =
  "M0 0 C14 -6 46 -16 90 -22 C128 -26 158 -18 176 -6 C186 2 180 8 164 9 C120 12 70 10 32 6 C14 3 4 1 0 0 Z";
const RIB = "M2 0 C40 -8 90 -14 150 -6";

const GRAINS: { x: number; y: number; r: number }[] = [
  { x: 496, y: 28, r: -18 },
  { x: 508, y: 22, r: -12 },
  { x: 520, y: 18, r: -8 },
  { x: 532, y: 16, r: -4 },
  { x: 488, y: 36, r: -28 },
  { x: 500, y: 32, r: -22 },
  { x: 514, y: 30, r: -16 },
  { x: 478, y: 24, r: 12 },
  { x: 470, y: 16, r: 18 },
  { x: 464, y: 8, r: 24 },
  { x: 504, y: 12, r: 6 },
  { x: 516, y: 8, r: 10 },
  { x: 492, y: 10, r: -6 },
  { x: 526, y: 26, r: -14 },
  { x: 484, y: 18, r: 8 },
  { x: 510, y: 38, r: -26 },
  { x: 498, y: 42, r: -32 },
  { x: 472, y: 30, r: 20 },
];

function Grain({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <ellipse
      className="rp-grain"
      cx={x}
      cy={y}
      rx="5.2"
      ry="2.6"
      transform={`rotate(${r} ${x} ${y})`}
    />
  );
}

function RiceLeaf({ x, y, rest, scale, i }: { x: number; y: number; rest: number; scale: number; i: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="rp-leaf-wind" data-leaf-wind={i}>
      <g
        data-leaf={i}
        data-rest={rest}
        className="rp-leaf"
        style={{ transform: `rotate(${rest - 18}deg) scale(0.05)`, opacity: 0, transformOrigin: "0px 0px" }}
      >
        <path className="rp-leaf-fill" d={BLADE} transform={`scale(${scale})`} />
        <path className="rp-leaf-rib" d={RIB} transform={`scale(${scale})`} />
      </g>
      </g>
    </g>
  );
}

function Companion({ x, flip }: { x: number; flip: boolean }) {
  const s = flip ? -0.78 : 0.78;
  return (
    <g className="rp-field" data-field transform={`translate(${x} 52) scale(${s} 0.78)`} style={{ opacity: 0 }}>
      <path
        className="rp-stem-stroke"
        d="M480 384 C478 320 484 240 480 170 C477 120 483 88 481 64"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path className="rp-leaf-fill" d={BLADE} transform="translate(479 300) rotate(-54) scale(0.9)" />
      <path className="rp-leaf-fill" d={BLADE} transform="translate(482 230) rotate(50) scale(1.05)" />
      <path className="rp-leaf-fill" d={BLADE} transform="translate(479 170) rotate(-46) scale(1.1)" />
      <path
        className="rp-rachis"
        d="M481 64 C490 44 504 28 522 18"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse className="rp-grain" cx="508" cy="28" rx="4.4" ry="2.2" transform="rotate(-16 508 28)" />
      <ellipse className="rp-grain" cx="518" cy="22" rx="4.4" ry="2.2" transform="rotate(-10 518 22)" />
      <ellipse className="rp-grain" cx="498" cy="34" rx="4.4" ry="2.2" transform="rotate(-24 498 34)" />
    </g>
  );
}

export function RicePlantSvg() {
  return (
    <svg
      className="rp-svg h-full w-full"
      viewBox="0 0 960 540"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A rice plant growing from a single seed"
    >
      <defs>
        <linearGradient id="rp-sky-wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef2ea" />
          <stop offset="55%" stopColor="#f3ead6" />
          <stop offset="100%" stopColor="#e6d3b0" />
        </linearGradient>
        <linearGradient id="rp-soil-deep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a4a30" />
          <stop offset="40%" stopColor="#4a3220" />
          <stop offset="100%" stopColor="#2c1c12" />
        </linearGradient>
        <linearGradient id="rp-soil-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a6240" stopOpacity="0.15" />
          <stop offset="18%" stopColor="#5a3c26" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#24160e" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="rp-stem-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6a7a3c" />
          <stop offset="55%" stopColor="#4f6a32" />
          <stop offset="100%" stopColor="#6d843c" />
        </linearGradient>
        <clipPath id="rp-soil-clip">
          <path d="M-40 392 C70 382 150 402 250 390 C350 378 420 398 480 388 C548 376 630 398 730 386 C830 374 910 394 1000 388 L1000 560 L-40 560 Z" />
        </clipPath>
        <clipPath id="rp-seed-clip">
          <ellipse cx="0" cy="0" rx="48" ry="20" />
        </clipPath>
        <radialGradient id="rp-glow" cx="38%" cy="18%" r="55%">
          <stop offset="0%" stopColor="#f4e4bc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f4e4bc" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g data-cam transform="translate(480 270) scale(2.62) translate(-480 -404)">
        <rect x="-200" y="-80" width="1360" height="760" fill="url(#rp-sky-wash)" />
        <image
          href="/images/growth/sky-atmosphere.jpg"
          x="-200"
          y="-80"
          width="1360"
          height="520"
          preserveAspectRatio="xMidYMid slice"
          opacity="0.88"
        />
        <rect x="-200" y="-80" width="1360" height="760" fill="url(#rp-glow)" />
        <rect className="rp-sky-tint" x="-200" y="-80" width="1360" height="760" />

        <Companion x={210} flip />
        <Companion x={750} flip={false} />

        <g className="rp-soil">
          <path
            fill="url(#rp-soil-deep)"
            d="M-40 392 C70 382 150 402 250 390 C350 378 420 398 480 388 C548 376 630 398 730 386 C830 374 910 394 1000 388 L1000 560 L-40 560 Z"
          />
          <image
            href="/images/growth/soil-texture.jpg"
            x="-40"
            y="300"
            width="1040"
            height="280"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#rp-soil-clip)"
            opacity="0.82"
          />
          <path
            fill="url(#rp-soil-face)"
            d="M-40 392 C70 382 150 402 250 390 C350 378 420 398 480 388 C548 376 630 398 730 386 C830 374 910 394 1000 388 L1000 560 L-40 560 Z"
          />
        </g>

        <g className="rp-roots" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            data-draw="rootMain"
            className="rp-root-main"
            pathLength={1}
            d="M476 398 C488 424 466 448 474 474 C480 496 458 512 468 536"
          />
          <path
            data-draw="rootBranch1"
            className="rp-root-side"
            pathLength={1}
            d="M474 432 C448 442 428 458 412 484 C402 500 388 510 376 526"
          />
          <path
            data-draw="rootBranch2"
            className="rp-root-side"
            pathLength={1}
            d="M478 452 C508 462 526 480 540 502 C550 516 566 524 574 538"
          />
          <path data-draw="rootHairs" className="rp-hair" pathLength={1} d="M470 456 C458 460 450 468 444 478" />
          <path data-draw="rootHairs" className="rp-hair" pathLength={1} d="M476 488 C490 494 498 504 502 514" />
          <path data-draw="rootHairs" className="rp-hair" pathLength={1} d="M456 470 C444 478 436 486 430 498" />
          <path data-draw="rootHairs" className="rp-hair" pathLength={1} d="M500 492 C512 498 522 506 528 516" />
        </g>

        <path
          className="rp-soil-lip"
          d="M-40 392 C70 382 150 402 250 390 C350 378 420 398 480 388 C548 376 630 398 730 386 C830 374 910 394 1000 388 L1000 404 C910 408 830 392 730 400 C630 410 548 392 480 402 C420 410 350 394 250 404 C150 414 70 398 -40 406 Z"
        />

        <g className="rp-sway-stem" style={{ transformOrigin: "480px 390px" }}>
          <path
            data-draw="coleoptile"
            className="rp-coleoptile"
            pathLength={1}
            fill="none"
            strokeLinecap="round"
            d="M478 384 C476 372 481 360 479 348"
          />
          <path
            data-draw="stem"
            className="rp-stem-stroke"
            pathLength={1}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M479 384 C477 348 483 318 479 288 C476 248 484 208 480 168 C477 128 483 94 481 62"
          />
          <path
            data-draw="stem"
            className="rp-stem-shine"
            pathLength={1}
            fill="none"
            strokeLinecap="round"
            d="M481 382 C479 346 485 316 481 286 C478 246 486 206 482 166 C479 126 485 94 483 64"
          />

          {LEAVES.map((leaf, i) => (
            <RiceLeaf key={leaf.y} i={i} {...leaf} />
          ))}

          <g data-panicle className="rp-panicle" style={{ transformOrigin: "481px 62px", transform: "rotate(0deg)" }}>
            <g className="rp-panicle-wind">
            <path
              data-draw="rachis"
              className="rp-rachis"
              pathLength={1}
              fill="none"
              strokeLinecap="round"
              d="M481 62 C488 46 500 32 516 20"
            />
            <path
              data-draw="panicle"
              className="rp-rachis"
              pathLength={1}
              fill="none"
              strokeLinecap="round"
              d="M490 48 C504 40 518 36 534 30"
            />
            <path
              data-draw="panicle"
              className="rp-rachis"
              pathLength={1}
              fill="none"
              strokeLinecap="round"
              d="M486 52 C474 40 464 28 456 14"
            />
            <path
              data-draw="panicle"
              className="rp-rachis"
              pathLength={1}
              fill="none"
              strokeLinecap="round"
              d="M494 40 C500 26 508 16 518 8"
            />
            <path
              data-draw="panicle"
              className="rp-rachis"
              pathLength={1}
              fill="none"
              strokeLinecap="round"
              d="M488 44 C480 32 470 22 462 10"
            />
            <g data-grains className="rp-grains" style={{ opacity: 0, transformOrigin: "500px 24px", transform: "scale(0.32)" }}>
              {GRAINS.map((g) => (
                <Grain key={`${g.x}-${g.y}`} {...g} />
              ))}
            </g>
            </g>
          </g>
        </g>

        <g transform="translate(480 396)">
          <g className="rp-seed-life">
          <g data-seed className="rp-seed" style={{ transform: "rotate(-16deg)", transformOrigin: "0px 0px" }}>
            <ellipse cx="2" cy="5" rx="46" ry="10" fill="#1a1008" opacity="0.28" />
            <ellipse cx="0" cy="0" rx="48" ry="20" fill="#e6d2a4" />
            <image
              href="/images/growth/one-rice-seed.jpg"
              x="-56"
              y="-28"
              width="112"
              height="56"
              clipPath="url(#rp-seed-clip)"
              preserveAspectRatio="xMidYMid slice"
            />
            <ellipse cx="0" cy="0" rx="48" ry="20" fill="none" stroke="rgba(255,236,208,0.35)" strokeWidth="1.1" />
            <path
              data-split
              className="rp-split"
              d="M-28 4 C-8 -2 10 -4 30 2"
              fill="none"
              stroke="#f0e2c4"
              strokeWidth="1.1"
              strokeLinecap="round"
              style={{ opacity: 0 }}
            />
          </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
