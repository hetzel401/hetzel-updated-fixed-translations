import React from "react";
import { Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const ClockWidget = () => {
  const [time, setTime] = React.useState(new Date());
  const { t } = useLanguage();

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
      <Clock className="w-5 h-5 text-blue-400" />
      <div className="flex flex-col">
        <span className="text-xs text-white/50 uppercase tracking-wider">{t.widgets.clock.title}</span>
        <span className="text-lg font-mono font-bold text-white">
          {time.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};