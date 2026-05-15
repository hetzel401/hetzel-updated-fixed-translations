import { useEffect, useRef, useState } from "react";

/**
 * Animates a numeric value from 0 to `target` over `duration` ms using
 * requestAnimationFrame. Returns 0 when `trigger` is false, and resets to 0
 * if `trigger` goes back to false. Cancels the animation frame on unmount.
 *
 * @param target   - The final numeric value to animate toward
 * @param duration - Animation duration in milliseconds
 * @param trigger  - Starts the animation when changed to true
 * @returns Current animated value (0 → target)
 */
export function useCountUp(target: number, duration: number, trigger: boolean): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(progress * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target, duration]);

  return count;
}
