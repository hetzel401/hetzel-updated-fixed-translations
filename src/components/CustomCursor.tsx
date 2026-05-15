import { useEffect, useRef, useState, type ReactElement } from "react";
import { useCustomization } from "@/context/CustomizationContext";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Map slider 5–30 to lerp ~0.06–0.28 */
function ringLerpFromConfig(lag: number) {
  const t = (clamp(lag, 5, 30) - 5) / 25;
  return 0.06 + t * 0.22;
}

export default function CustomCursor(): null | ReactElement {
  const { config } = useCustomization();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const trailPositions = useRef<{ x: number; y: number }[]>([]);
  const rafRef = useRef(0);
  const [clicking, setClicking] = useState(false);

  const cursorStyle = config.cursorStyle;
  const cursorColor = config.cursorColor;
  const cursorSize = config.cursorSize;
  const trailLength = config.cursorTrailLength;
  const emoji = config.cursorEmoji;
  const ringLerp = ringLerpFromConfig(config.cursorRingLag ?? 12);
  const blend = config.cursorBlendMode === "difference" ? "difference" : "normal";

  const ringBootstrapped = useRef(false);

  useEffect(() => {
    ringBootstrapped.current = false;
  }, [cursorStyle]);

  const reduced = config.reducedMotion;

  const [active, setActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      !reduced &&
      !window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });

  useEffect(() => {
    const coarseMq = window.matchMedia("(pointer: coarse)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setActive(!reduced && !coarseMq.matches && !reducedMq.matches);
    coarseMq.addEventListener("change", update);
    reducedMq.addEventListener("change", update);
    update();
    return () => {
      coarseMq.removeEventListener("change", update);
      reducedMq.removeEventListener("change", update);
    };
  }, [reduced]);

  useEffect(() => {
    if (!active || cursorStyle === "none") return;
    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (cursorStyle === "ring" && !ringBootstrapped.current) {
        ringPosRef.current = { x: e.clientX, y: e.clientY };
        ringBootstrapped.current = true;
      }
      if (cursorStyle !== "ring" && dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onMouseDown = () => setClicking(true);
    const onMouseUp = () => setClicking(false);

    const onMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
      trailRefs.current.forEach((r) => {
        if (r) r.style.opacity = "0";
      });
    };
    const onMouseEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
      trailRefs.current.forEach((r) => {
        if (r) r.style.opacity = "1";
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const noRafLoop =
      cursorStyle === "emoji" ||
      cursorStyle === "crosshair" ||
      (cursorStyle === "trail" && reduced);

    if (noRafLoop) {
      return () => {
        document.body.style.cursor = "";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("mouseenter", onMouseEnter);
      };
    }

    trailPositions.current = Array.from({ length: trailLength }, () => ({ ...mouseRef.current }));

    const animate = () => {
      const { x: mx, y: my } = mouseRef.current;
      ringPosRef.current.x += (mx - ringPosRef.current.x) * ringLerp;
      ringPosRef.current.y += (my - ringPosRef.current.y) * ringLerp;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosRef.current.x}px`;
        ringRef.current.style.top = `${ringPosRef.current.y}px`;
      }

      if (cursorStyle === "trail" && !reduced) {
        for (let i = trailPositions.current.length - 1; i > 0; i--) {
          trailPositions.current[i].x += (trailPositions.current[i - 1].x - trailPositions.current[i].x) * 0.3;
          trailPositions.current[i].y += (trailPositions.current[i - 1].y - trailPositions.current[i].y) * 0.3;
        }
        if (trailPositions.current.length > 0) {
          trailPositions.current[0] = { x: mx, y: my };
        }
        trailRefs.current.forEach((ref, i) => {
          if (ref && trailPositions.current[i]) {
            ref.style.left = `${trailPositions.current[i].x}px`;
            ref.style.top = `${trailPositions.current[i].y}px`;
          }
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, cursorStyle, cursorSize, trailLength, ringLerp, reduced, config.cursorBlendMode]);

  if (!active || cursorStyle === "none") {
    if (typeof document !== "undefined") document.body.style.cursor = "";
    return null;
  }

  const ringSize = cursorSize * 3.5;
  const clickScale = clicking ? 0.8 : 1;

  if (cursorStyle === "emoji") {
    return (
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: blend,
          transform: `translate(-50%, -50%) scale(${clickScale})`,
          transition: reduced ? "opacity 0.2s" : "transform 0.1s, opacity 0.2s",
          fontSize: cursorSize * 2.5,
          left: 0,
          top: 0,
        }}
      >
        {emoji}
      </div>
    );
  }

  if (cursorStyle === "crosshair") {
    const size = cursorSize * 3;
    return (
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: blend,
          width: size,
          height: size,
          transform: `translate(-50%, -50%) scale(${clickScale})`,
          transition: reduced ? "opacity 0.2s" : "transform 0.1s, opacity 0.2s",
          left: 0,
          top: 0,
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke={cursorColor} strokeWidth={1.5} opacity={0.8} />
          <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke={cursorColor} strokeWidth={1.5} opacity={0.8} />
          <circle cx={size / 2} cy={size / 2} r={2} fill={cursorColor} />
        </svg>
      </div>
    );
  }

  if (cursorStyle === "glow") {
    return (
      <>
        <div
          ref={dotRef}
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 9999,
            mixBlendMode: blend,
            width: cursorSize * 4,
            height: cursorSize * 4,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${cursorColor} 0%, transparent 70%)`,
            transform: `translate(-50%, -50%) scale(${clickScale})`,
            transition: reduced ? "opacity 0.2s" : "transform 0.1s, opacity 0.2s",
            opacity: 0.6,
            left: 0,
            top: 0,
          }}
        />
        <div
          ref={ringRef}
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 9998,
            mixBlendMode: blend,
            width: cursorSize * 8,
            height: cursorSize * 8,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${cursorColor}22 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            transition: "opacity 0.2s",
            left: 0,
            top: 0,
          }}
        />
      </>
    );
  }

  if (cursorStyle === "trail" && !reduced) {
    return (
      <>
        {Array.from({ length: trailLength }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) trailRefs.current[i] = el;
            }}
            style={{
              position: "fixed",
              pointerEvents: "none",
              zIndex: 9999 - i,
              mixBlendMode: blend,
              width: cursorSize * (1 - i * 0.12),
              height: cursorSize * (1 - i * 0.12),
              borderRadius: "50%",
              background: cursorColor,
              opacity: 1 - i * (0.8 / trailLength),
              transform: "translate(-50%, -50%)",
              transition: "opacity 0.2s",
              left: 0,
              top: 0,
            }}
          />
        ))}
      </>
    );
  }

  if (cursorStyle === "trail" && reduced) {
    return (
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: blend,
          width: cursorSize,
          height: cursorSize,
          borderRadius: "50%",
          background: cursorColor,
          transform: `translate(-50%, -50%) scale(${clickScale})`,
          transition: "opacity 0.2s",
          left: 0,
          top: 0,
        }}
      />
    );
  }

  if (cursorStyle === "ring") {
    return (
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9998,
          mixBlendMode: blend,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: `2px solid ${cursorColor}cc`,
          transform: `translate(-50%, -50%) scale(${clicking ? 0.92 : 1})`,
          transition: reduced ? "opacity 0.2s" : "transform 0.15s, opacity 0.2s",
          left: 0,
          top: 0,
        }}
      />
    );
  }

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: blend,
          width: cursorSize,
          height: cursorSize,
          borderRadius: "50%",
          background: cursorColor,
          boxShadow: `0 0 ${cursorSize}px 2px ${cursorColor}`,
          transform: `translate(-50%, -50%) scale(${clickScale})`,
          transition: reduced ? "opacity 0.2s" : "transform 0.1s, opacity 0.2s",
          left: 0,
          top: 0,
        }}
      />
      {(cursorStyle === "dot" || cursorStyle === "default") && (
        <div
          ref={ringRef}
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 9998,
            mixBlendMode: blend,
            width: ringSize,
            height: ringSize,
            borderRadius: "50%",
            border: `1.5px solid ${cursorColor}99`,
            transform: `translate(-50%, -50%) scale(${clicking ? 0.9 : 1})`,
            transition: reduced ? "opacity 0.2s" : "transform 0.15s, opacity 0.2s",
            left: 0,
            top: 0,
          }}
        />
      )}
    </>
  );
}
