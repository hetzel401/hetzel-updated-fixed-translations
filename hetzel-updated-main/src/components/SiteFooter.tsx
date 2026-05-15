import { useLanguage } from "@/context/LanguageContext";

export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 font-mono text-xs text-muted-foreground md:flex-row">
        <span>© {new Date().getFullYear()} Hetzel401 · {t.footer.crafted}</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent opacity-80" />
          {t.footer.status}
        </span>
      </div>
    </footer>
  );
}
