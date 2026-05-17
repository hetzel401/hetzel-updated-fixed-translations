import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useCustomization, type BackgroundImageFit, DEFAULT_BACKGROUND_GRADIENT } from "@/context/CustomizationContext";
import OrbLayer from "@/components/OrbLayer";

function bgSizeFromFit(fit: BackgroundImageFit): string {
  if (fit === "contain") return "contain";
  if (fit === "stretch") return "100% 100%";
  if (fit === "repeat") return "auto";
  return "cover";
}

function bgRepeatFromFit(fit: BackgroundImageFit): string {
  return fit === "repeat" ? "repeat" : "no-repeat";
}

function BackgroundStack({ children }: { children: ReactNode }) {
  const { config } = useCustomization();
  const overlayPct = config.backgroundOverlayOpacity / 100;
  const tint = config.backgroundOverlayTint || "#000000";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1]"
      style={{ opacity: config.backgroundOpacity / 100 }}
    >
      <div className="absolute inset-0" style={{ filter: config.backgroundBlur > 0 ? `blur(${config.backgroundBlur}px)` : undefined }}>
        {children}
      </div>
      {overlayPct > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: tint,
            opacity: overlayPct,
          }}
        />
      )}
    </div>
  );
}

function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    let frame = 0;
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      stars.forEach((s) => {
        const op = s.opacity * (0.5 + Math.sin(frame * s.twinkleSpeed) * 0.5);
        ctx.fillStyle = `rgba(200, 180, 255, ${op})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -5) {
          s.y = canvas.height + 5;
          s.x = Math.random() * canvas.width;
        }
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let cols = Math.floor(canvas.width / 16);
    let drops = Array.from({ length: cols }, () => Math.random() * (canvas.height / 16));
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()";

    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(120, 80, 255, 0.35)";
      ctx.font = "14px monospace";
      drops.forEach((d, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, d * 16);
        if (d * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      cols = Math.floor(canvas.width / 16);
      drops = Array.from({ length: cols }, () => Math.random() * (canvas.height / 16));
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />;
}

function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { config } = useCustomization();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const count = config.particleCount;
    const color = config.particleColor;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = color + "88";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = color + Math.floor((1 - dist / 120) * 40)
              .toString(16)
              .padStart(2, "0");
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [config.particleCount, config.particleColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="animate-aurora-1 absolute -left-1/2 -top-1/2 h-[200%] w-[200%]"
        style={{ background: "radial-gradient(ellipse at 40% 50%, hsl(260 80% 50% / 0.15), transparent 60%)" }}
      />
      <div
        className="animate-aurora-2 absolute -left-1/2 -top-1/2 h-[200%] w-[200%]"
        style={{ background: "radial-gradient(ellipse at 60% 40%, hsl(220 80% 50% / 0.12), transparent 50%)" }}
      />
      <div
        className="animate-aurora-3 absolute -left-1/2 -top-1/2 h-[200%] w-[200%]"
        style={{ background: "radial-gradient(ellipse at 30% 60%, hsl(300 80% 50% / 0.1), transparent 55%)" }}
      />
    </div>
  );
}

function WavesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute bottom-0 h-64 w-full opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="hsl(260 85% 70% / 0.3)"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,170.7C960,203,1056,245,1152,234.7C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        >
          <animateTransform attributeName="transform" type="translate" values="0,0;50,10;0,0" dur="8s" repeatCount="indefinite" />
        </path>
      </svg>
      <svg className="absolute bottom-0 h-48 w-full opacity-15" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="hsl(220 85% 60% / 0.3)"
          d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        >
          <animateTransform attributeName="transform" type="translate" values="0,0;-30,5;0,0" dur="6s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}

export default function BackgroundManager() {
  const { config } = useCustomization();
  const fit = config.backgroundImageFit ?? "cover";
  const pos = config.backgroundImagePosition ?? "center";
  const objectPosition = pos === "top" ? "center top" : pos === "bottom" ? "center bottom" : "center";

  const imageSrc = config.backgroundImage?.trim() ?? "";
  const imageLayerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: imageSrc ? `url(${JSON.stringify(imageSrc)})` : undefined,
    backgroundSize: bgSizeFromFit(fit),
    backgroundPosition: objectPosition,
    backgroundRepeat: bgRepeatFromFit(fit),
  };

  const gradientCss = config.backgroundGradient?.trim() || DEFAULT_BACKGROUND_GRADIENT;

  switch (config.backgroundType) {
    case "orbs":
      return <OrbLayer />;
    case "gradient":
      return (
        <BackgroundStack>
          <div className="absolute inset-0" style={{ background: gradientCss }} />
        </BackgroundStack>
      );
    case "solid":
      return (
        <BackgroundStack>
          <div className="absolute inset-0" style={{ background: config.backgroundColor }} />
        </BackgroundStack>
      );
    case "stars":
      return (
        <BackgroundStack>
          <StarsBackground />
        </BackgroundStack>
      );
    case "matrix":
      return (
        <BackgroundStack>
          <MatrixBackground />
        </BackgroundStack>
      );
    case "particles":
      return (
        <BackgroundStack>
          <ParticlesBackground />
        </BackgroundStack>
      );
    case "aurora":
      return (
        <BackgroundStack>
          <AuroraBackground />
        </BackgroundStack>
      );
    case "waves":
      return (
        <BackgroundStack>
          <WavesBackground />
        </BackgroundStack>
      );
    case "custom-image":
      if (!imageSrc) return null;
      return (
        <BackgroundStack>
          <div style={imageLayerStyle} />
        </BackgroundStack>
      );
    default:
      return null;
  }
}
