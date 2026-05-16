import { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { useCustomization } from "@/context/CustomizationContext";

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "It's not a bug; it's an undocumented feature.", author: "Anonymous" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" },
  { text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
  { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { text: "In theory, there is no difference between theory and practice. But, in practice, there is.", author: "Jan L. A. van de Snepscheut" },
  { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupery" },
];

export default function QuoteWidget() {
  const { config } = useCustomization();
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    const id = setInterval(() => setIdx(Math.floor(Math.random() * QUOTES.length)), 30000);
    return () => clearInterval(id);
  }, []);

  if (!config.quoteWidgetVisible) return null;

  const quote = QUOTES[idx];

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div className="glass rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <Quote className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground/80 italic leading-relaxed">"{quote.text}"</p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">-- {quote.author}</p>
          </div>
          <button onClick={() => setIdx(Math.floor(Math.random() * QUOTES.length))} className="p-1 rounded-full hover:bg-secondary transition-colors shrink-0" title="New quote">
            <RefreshCw className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
