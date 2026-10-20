import "./global.css";

import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./src/auth/AuthContext";
import { MobileShell } from "./src/components/MobileShell";
import { AboutScreen } from "./src/screens/AboutScreen";
import { ChatScreen } from "./src/screens/ChatScreen";
import { DocumentsScreen } from "./src/screens/DocumentsScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { JourneyScreen } from "./src/screens/JourneyScreen";
import { PackagesScreen } from "./src/screens/PackagesScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ServicesScreen } from "./src/screens/ServicesScreen";
import type { RouteName } from "./src/types";

const PUBLIC_ROUTES: RouteName[] = ["login", "register"];

function AppRoutes() {
  const { user, initializing } = useAuth();
  const [activeRoute, setActiveRoute] = useState<RouteName>("home");

  // Follow the session: land on login when signed out, home when signed in.
  useEffect(() => {
    if (initializing) {
      return;
    }

    setActiveRoute((current) => {
      if (!user) {
        return PUBLIC_ROUTES.includes(current) ? current : "login";
      }

      return PUBLIC_ROUTES.includes(current) ? "home" : current;
    });
  }, [user, initializing]);

  if (initializing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Signed out: only the auth screens are reachable, and the shell chrome
  // (nav/footer) is hidden so there is nothing to navigate into.
  if (!user) {
    return activeRoute === "register" ? (
      <RegisterScreen onNavigate={setActiveRoute} />
    ) : (
      <LoginScreen onNavigate={setActiveRoute} />
    );
  }

  return (
    <MobileShell activeRoute={activeRoute} onNavigate={setActiveRoute}>
      {activeRoute === "home" && <HomeScreen onNavigate={setActiveRoute} />}
      {activeRoute === "about" && <AboutScreen onNavigate={setActiveRoute} />}
      {activeRoute === "packages" && (
        <PackagesScreen onNavigate={setActiveRoute} />
      )}
      {activeRoute === "journey" && <JourneyScreen />}
      {activeRoute === "services" && (
        <ServicesScreen onNavigate={setActiveRoute} />
      )}
      {activeRoute === "documents" && <DocumentsScreen />}
      {activeRoute === "chat" && <ChatScreen />}
    </MobileShell>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
