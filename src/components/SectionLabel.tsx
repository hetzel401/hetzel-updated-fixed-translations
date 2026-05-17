export function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-accent">
      <span className="h-px w-8 bg-accent shrink-0" />
      {label}
    </div>
  );
}
