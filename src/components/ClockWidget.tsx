import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useCustomization } from "@/context/CustomizationContext";

const positionStyles: Record<string, React.CSSProperties> = {
  "bottom-left": { position: "fixed", bottom: "5rem", left: "1.5rem", zIndex: 50 },
  "bottom-right": { position: "fixed", bottom: "5rem", right: "1.5rem", zIndex: 50 },
  "top-left": { position: "fixed", top: "5rem", left: "1.5rem", zIndex: 50 },
  "top-right": { position: "fixed", top: "5rem", right: "1.5rem", zIndex: 50 },
};

export default function ClockWidget() {
  const { config } = useCustomization();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!config.clockWidgetVisible) return null;

  const pos = positionStyles[config.clockWidgetPosition] ?? positionStyles["top-right"];

  const formatTime = () => {
    const h = time.getHours();
    const m = time.getMinutes().toString().padStart(2, "0");
    const s = time.getSeconds().toString().padStart(2, "0");

    if (config.clockFormat === "24h") {
      return config.clockShowSeconds ? `${h.toString().padStart(2, "0")}:${m}:${s}` : `${h.toString().padStart(2, "0")}:${m}`;
    }

    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return config.clockShowSeconds ? `${h12}:${m}:${s} ${ampm}` : `${h12}:${m} ${ampm}`;
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div style={pos}>
      <div className="glass rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-sm font-medium tabular-nums">{formatTime()}</span>
        </div>
        <div className="mt-1 font-mono text-[10px] text-muted-foreground">
          {dayNames[time.getDay()]}, {monthNames[time.getMonth()]} {time.getDate()}
        </div>
      </div>
    </div>
  );
}
