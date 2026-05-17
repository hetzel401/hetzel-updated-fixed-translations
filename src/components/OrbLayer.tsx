// OrbLayer — floating gradient orbs background component with cursor tracking
// All orb configuration is computed once at module load via a deterministic
// seeded PRNG so React re-renders never reset animation state.
// Enhanced with cursor-tracking for interactive experience.

import { motion, useReducedMotion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Seeded pseudo-random number generator (linear-congruential)
// ---------------------------------------------------------------------------

/**
 * Returns a deterministic pseudo-random number generator seeded with `seed`.
 * Each call to the returned function advances the internal state and produces
 * a value in [0, 1).
 *
 * Uses the Numerical Recipes LCG parameters:
 *   s = (s * 1664525 + 1013904223) & 0xffffffff
 */
export function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ---------------------------------------------------------------------------
// OrbConfig type
// ---------------------------------------------------------------------------

export type OrbConfig = {
  /** 0-indexed integer identifier */
  id: number;
  /** CSS radial-gradient string, e.g. "radial-gradient(circle, hsl(260 85% 70% / 1) 0%, transparent 70%)" */
  color: string;
  /** Diameter in px; 300 ≤ size ≤ 700 */
  size: number;
  /** Horizontal starting position as a vw string, e.g. "20vw" */
  initialX: string;
  /** Vertical starting position as a vh string, e.g. "15vh" */
  initialY: string;
  /** 3-element Framer Motion keyframe array for x translation (px offsets) */
  animateX: number[];
  /** 3-element Framer Motion keyframe array for y translation (px offsets) */
  animateY: number[];
  /** 3-element Framer Motion keyframe array for scale; values in 0.85–1.15 */
  animateScale: number[];
  /** Animation cycle duration in seconds; 18 ≤ duration ≤ 35 */
  duration: number;
  /** Independent scale animation cycle duration in seconds; 10 ≤ scaleDuration ≤ 22 */
  scaleDuration: number;
  /** CSS opacity; 0.12 ≤ opacity ≤ 0.25 */
  opacity: number;
  /** Cursor influence strength (0–1) */
  cursorInfluence: number;
};

// ---------------------------------------------------------------------------
// Palette colors for orb gradients
// ---------------------------------------------------------------------------

const PALETTE = [
  "hsl(260 85% 70%)", // accent
  "hsl(240 80% 60%)", // indigo
  "hsl(275 90% 80%)", // lilac
] as const;

// ---------------------------------------------------------------------------
// buildOrbs — constructs the static ORBS array deterministically
// ---------------------------------------------------------------------------

/**
 * Builds 5 `OrbConfig` entries using `seeded(n)` for each orb index `n`.
 * All values are derived from the seeded PRNG so the same layout is produced
 * on every module evaluation (no `Math.random()` calls).
 *
 * Exported for testability.
 */
export function buildOrbs(): OrbConfig[] {
  return Array.from({ length: 5 }, (_, n): OrbConfig => {
    const rand = seeded(n);

    // size: 300–700 px
    const size = Math.round(300 + rand() * 400);

    // opacity: 0.12–0.25
    const opacity = parseFloat((0.12 + rand() * 0.13).toFixed(4));

    // duration: 18–35 s
    const duration = parseFloat((18 + rand() * 17).toFixed(2));

    // scaleDuration: 10–22 s
    const scaleDuration = parseFloat((10 + rand() * 12).toFixed(2));

    // initialX: "Nvw" where 5 ≤ N ≤ 90
    const initialX = `${Math.round(5 + rand() * 85)}vw`;

    // initialY: "Nvh" where 5 ≤ N ≤ 90
    const initialY = `${Math.round(5 + rand() * 85)}vh`;

    // animateX: 3-element keyframe array (px offsets, -150 to +150)
    const animateX = [
      Math.round((rand() - 0.5) * 300),
      Math.round((rand() - 0.5) * 300),
      Math.round((rand() - 0.5) * 300),
    ];

    // animateY: 3-element keyframe array (px offsets, -150 to +150)
    const animateY = [
      Math.round((rand() - 0.5) * 300),
      Math.round((rand() - 0.5) * 300),
      Math.round((rand() - 0.5) * 300),
    ];

    // animateScale: 3-element array, values in 0.85–1.15
    const animateScale = [
      parseFloat((0.85 + rand() * 0.30).toFixed(3)),
      parseFloat((0.85 + rand() * 0.30).toFixed(3)),
      parseFloat((0.85 + rand() * 0.30).toFixed(3)),
    ];

    // cursorInfluence: 0.2–0.6 (varies per orb)
    const cursorInfluence = parseFloat((0.2 + rand() * 0.4).toFixed(2));

    // color: cycle through palette colors
    const paletteColor = PALETTE[n % PALETTE.length];
    const color = `radial-gradient(circle, ${paletteColor} 0%, transparent 70%)`;

    return {
      id: n,
      color,
      size,
      initialX,
      initialY,
      animateX,
      animateY,
      animateScale,
      duration,
      scaleDuration,
      opacity,
      cursorInfluence,
    };
  });
}

// ---------------------------------------------------------------------------
// Module-level ORBS constant — computed once at module load
// ---------------------------------------------------------------------------

/** Static orb configuration array. Computed once; never changes after module load. */
export const ORBS: OrbConfig[] = buildOrbs();

// ---------------------------------------------------------------------------
// Orb component with cursor tracking
// ---------------------------------------------------------------------------

interface OrbProps {
  orb: OrbConfig;
  shouldAnimate: boolean;
  mouseX: ReturnType<typeof useMotionValue>;
  mouseY: ReturnType<typeof useMotionValue>;
}

function Orb({ orb, shouldAnimate, mouseX, mouseY }: OrbProps): JSX.Element {
  const initialXPx = useRef(0);
  const initialYPx = useRef(0);

  // Convert initial position to pixels
  useEffect(() => {
    if (typeof window === "undefined") return;
    const vwValue = parseInt(orb.initialX) * (window.innerWidth / 100);
    const vhValue = parseInt(orb.initialY) * (window.innerHeight / 100);
    initialXPx.current = vwValue;
    initialYPx.current = vhValue;
  }, [orb.initialX, orb.initialY]);

  // Calculate distance from cursor and apply attraction
  const cursorDistance = useTransform(
    [mouseX, mouseY],
    ([x, y]: [number, number]) => {
      const dx = x - initialXPx.current;
      const dy = y - initialYPx.current;
      return Math.sqrt(dx * dx + dy * dy);
    }
  );

  const cursorOffsetX = useTransform(
    mouseX,
    (x) => {
      const dx = x - initialXPx.current;
      return dx * orb.cursorInfluence * 0.15;
    }
  );

  const cursorOffsetY = useTransform(
    mouseY,
    (y) => {
      const dy = y - initialYPx.current;
      return dy * orb.cursorInfluence * 0.15;
    }
  );

  return (
    <motion.div
      key={orb.id}
      initial={{ x: 0, y: 0, scale: 1 }}
      animate={
        shouldAnimate
          ? { x: orb.animateX, y: orb.animateY, scale: orb.animateScale }
          : undefined
      }
      transition={
        shouldAnimate
          ? {
              x: { duration: orb.duration, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
              y: { duration: orb.duration, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
              scale: { duration: orb.scaleDuration, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
            }
          : undefined
      }
      style={{
        position: "absolute",
        left: orb.initialX,
        top: orb.initialY,
        width: orb.size,
        height: orb.size,
        borderRadius: "50%",
        background: orb.color,
        opacity: orb.opacity,
        filter: `blur(${Math.max(80, Math.round(orb.size * 0.18))}px)`,
        willChange: "transform",
        transform: "translate(-50%, -50%)",
        x: cursorOffsetX,
        y: cursorOffsetY,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// OrbLayer component
// ---------------------------------------------------------------------------

/**
 * Renders a fixed full-viewport layer of blurred gradient orbs behind all
 * page content with cursor-tracking interaction. No props, no external state.
 */
export default function OrbLayer(): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: -20,
      }}
    >
      {ORBS.map((orb) => (
        <Orb
          key={orb.id}
          orb={orb}
          shouldAnimate={shouldAnimate}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </div>
  );
}
