import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="top" className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <Nav />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
