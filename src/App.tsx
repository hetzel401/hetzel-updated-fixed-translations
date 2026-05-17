import { Route, Routes, Router as WouterRouter } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/context/LanguageContext";
import { CustomizationProvider } from "@/context/CustomizationContext";
import { LanyardProvider } from "@/context/LanyardContext";
import Index from "@/pages/Index";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/not-found";
import CustomCursor from "@/components/CustomCursor";
import BackgroundManager from "@/components/BackgroundManager";
import EffectsLayer from "@/components/EffectsLayer";
import WindowsNav from "@/components/WindowsNav";
import NowPlayingWidget from "@/components/NowPlayingWidget";
import StatusBanner from "@/components/StatusBanner";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import ClickRipple from "@/components/ClickRipple";
import ClockWidget from "@/components/ClockWidget";
import QuoteWidget from "@/components/QuoteWidget";
import LoadingScreen from "@/components/LoadingScreen";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import LiveFavicon from "@/components/LiveFavicon";

function Router() {
  return (
    <Routes>
      <Route path="/" component={Index} />
      <Route path="/admin" component={DashboardPage} />
      <Route path="*" component={NotFound} />
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <CustomizationProvider>
          <LanyardProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="windows-shell">
              <LiveFavicon />
              <LoadingScreen />
              <AnnouncementBanner />
              <ScrollProgress />
              <CustomCursor />
              <ClickRipple />
              <BackgroundManager />
              <EffectsLayer />
              <WindowsNav />
              <CommandPalette />
              <Router />
              <NowPlayingWidget />
              <StatusBanner />
              <ClockWidget />
              <QuoteWidget />
              <BackToTop />
            </div>
          </WouterRouter>
          </LanyardProvider>
        </CustomizationProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
