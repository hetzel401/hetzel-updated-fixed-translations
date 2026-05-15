import { useEffect, useRef } from "react";
import { useLanyardContext } from "@/context/LanyardContext";

const STATUS_HEX: Record<string, string> = {
  online: "#34d399",
  idle: "#fbbf24",
  dnd: "#f43f5e",
  offline: "#71717a",
};

function drawFavicon(canvas: HTMLCanvasElement, status: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const s = canvas.width;

  ctx.clearRect(0, 0, s, s);

  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.35;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#a78bfa";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#c4b5fd";
  ctx.lineWidth = Math.max(1, s * 0.06);
  ctx.stroke();

  const innerR = r * 0.4;
  ctx.beginPath();
  ctx.arc(cx - r * 0.25, cy - r * 0.15, innerR, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx + r * 0.25, cy - r * 0.15, innerR, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.2, r * 0.3, r * 0.25, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  const dotR = s * 0.09;
  const dotX = s - dotR - s * 0.04;
  const dotY = s - dotR - s * 0.04;

  ctx.beginPath();
  ctx.arc(dotX, dotY, dotR + 1.5, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1a2e";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
  ctx.fillStyle = STATUS_HEX[status] ?? STATUS_HEX.offline;
  ctx.fill();

  const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (link) {
    link.href = canvas.toDataURL("image/png");
  }
}

export default function LiveFavicon() {
  const { data } = useLanyardContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const status = data?.discord_status ?? "offline";

  useEffect(() => {
    if (!canvasRef.current) return;
    drawFavicon(canvasRef.current, status);
  }, [status]);

  return <canvas ref={canvasRef} width={32} height={32} hidden />;
}
