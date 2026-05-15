import { Switch, Route, Router as WouterRouter } from "wouter";
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
import SettingsPanel from "@/components/SettingsPanel";
import NowPlayingWidget from "@/components/NowPlayingWidget";
import StatusBanner from "@/components/StatusBanner";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import ClickRipple from "@/components/ClickRipple";
import ClockWidget from "@/components/ClockWidget";
import QuoteWidget from "@/components/QuoteWidget";
import LoadingScreen from "@/components/LoadingScreen";
import LiveFavicon from "@/components/LiveFavicon";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/admin" component={DashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <CustomizationProvider>
          <LanyardProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <LiveFavicon />
            <LoadingScreen />
              <ScrollProgress />
              <CustomCursor />
              <ClickRipple />
              <BackgroundManager />
              <EffectsLayer />
              <SettingsPanel />
              <CommandPalette />
              <Router />
              <NowPlayingWidget />
              <StatusBanner />
              <ClockWidget />
              <QuoteWidget />
              <BackToTop />
            </WouterRouter>
          </LanyardProvider>
        </CustomizationProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
