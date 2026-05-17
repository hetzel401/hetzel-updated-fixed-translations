import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/context/LanguageContext";
import { CustomizationProvider } from "@/context/CustomizationContext";
import { LanyardProvider } from "@/context/LanyardContext";
import Index from "@/pages/Index";
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

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <CustomizationProvider>
          <LanyardProvider>
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
              <Index />
              <NowPlayingWidget />
              <StatusBanner />
              <ClockWidget />
              <QuoteWidget />
              <BackToTop />
            </div>
          </LanyardProvider>
        </CustomizationProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
