import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <Nav />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-32">
        <p className="font-mono text-xs tracking-[0.35em] text-accent">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 max-w-sm text-center text-sm text-muted-foreground">
          This path does not exist. Use the navigation above or return home.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:bg-card/60"
        >
          Go home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
