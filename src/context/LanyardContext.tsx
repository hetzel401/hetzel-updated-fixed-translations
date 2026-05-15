import { createContext, useContext, ReactNode } from "react";
import { useLanyard } from "@/hooks/use-lanyard";

type LanyardCtx = ReturnType<typeof useLanyard>;

const LanyardContext = createContext<LanyardCtx | null>(null);

export function LanyardProvider({ children }: { children: ReactNode }) {
  const value = useLanyard();
  return <LanyardContext.Provider value={value}>{children}</LanyardContext.Provider>;
}

export function useLanyardContext() {
  const ctx = useContext(LanyardContext);
  if (!ctx) throw new Error("useLanyardContext must be used inside LanyardProvider");
  return ctx;
}
