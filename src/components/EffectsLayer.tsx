import { useEffect, useRef } from "react";
import { useCustomization } from "@/context/CustomizationContext";

function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const flakes = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1, speed: Math.random() * 1 + 0.5,
      wind: Math.random() * 0.5 - 0.25,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flakes.forEach((f) => {
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2); ctx.fill();
        f.y += f.speed; f.x += f.wind;
        if (f.y > canvas.height) { f.y = -5; f.x = Math.random() * canvas.width; }
        if (f.x < 0) f.x = canvas.width;
        if (f.x > canvas.width) f.x = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
}

function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const drops = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      length: Math.random() * 15 + 5, speed: Math.random() * 8 + 4,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(174, 194, 224, 0.3)";
      ctx.lineWidth = 1;
      drops.forEach((d) => {
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + 1, d.y + d.length); ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) { d.y = -d.length; d.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
}

function FireflyEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const flies = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 3 + 1, phase: Math.random() * Math.PI * 2,
    }));
    let frame = 0;
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      flies.forEach((f) => {
        const op = 0.3 + Math.sin(frame * 0.03 + f.phase) * 0.3;
        ctx.fillStyle = `rgba(200, 180, 100, ${op})`;
        ctx.shadowColor = "rgba(255, 220, 100, 0.8)";
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        f.x += f.vx; f.y += f.vy;
        f.vx += (Math.random() - 0.5) * 0.1;
        f.vy += (Math.random() - 0.5) * 0.1;
        f.vx *= 0.99; f.vy *= 0.99;
        if (f.x < 0 || f.x > canvas.width) f.vx *= -1;
        if (f.y < 0 || f.y > canvas.height) f.vy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
}

function ConfettiEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#a78bfa", "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#f97316"];
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4, h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2 + 1, wobble: Math.random() * 10,
      wobbleSpeed: Math.random() * 0.1 + 0.02, rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    }));
    let raf: number;
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      pieces.forEach((p) => {
        ctx.save();
        ctx.translate(p.x + Math.sin(frame * p.wobbleSpeed) * p.wobble, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
}

function GlitchEffect() {
  return (
    <div className="fixed inset-0 z-[65] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 animate-glitch-1 bg-accent/5 mix-blend-overlay" />
      <div className="absolute inset-0 animate-glitch-2 bg-indigo-500/5 mix-blend-overlay" />
    </div>
  );
}

export default function EffectsLayer() {
  const { config } = useCustomization();

  return (
    <>
      {config.snowEffect && <SnowEffect />}
      {config.rainEffect && <RainEffect />}
      {config.fireflyEffect && <FireflyEffect />}
      {config.confettiEffect && <ConfettiEffect />}
      {config.glitchEffect && <GlitchEffect />}
      {config.scanlineEffect && <div className="fixed inset-0 z-[60] pointer-events-none scanline opacity-40" />}
      {config.vignetteEffect && (
        <div className="fixed inset-0 z-[60] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
      )}
      {config.bloomEffect && (
        <div className="fixed inset-0 z-[55] pointer-events-none" style={{ backdropFilter: "brightness(1.05) contrast(1.05)" }} />
      )}
    </>
  );
}