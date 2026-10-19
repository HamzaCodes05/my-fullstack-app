import { useState, type ReactNode } from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../auth/AuthContext";
import { MobileNavigationContext } from "./MobileNavigationContext";
import { navItems } from "../data/purePath";
import type { Navigate, RouteName } from "../types";
import { cn } from "../utils/cn";

type MobileShellProps = {
  activeRoute: RouteName;
  onNavigate: Navigate;
  children: ReactNode;
};

export function MobileShell({
  activeRoute,
  onNavigate,
  children,
}: MobileShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const menuItems: { label: string; route: RouteName }[] = navItems;

  function handleNavigate(route: RouteName) {
    onNavigate(route);
    setMenuOpen(false);
  }

  const menuButtonToneClass = menuOpen
    ? "border-pure-green bg-pure-green"
    : "border-pure-line bg-white/90";
  const menuLineToneClass = menuOpen ? "bg-pure-white" : "bg-pure-green";

  return (
    <SafeAreaView className="flex-1 bg-pure-white">
      <StatusBar barStyle="dark-content" className="bg-pure-white" />

      <View className="relative z-20 border-b border-pure-line bg-pure-white pt-2 elevation-xl android:pt-safe-offset-2 web:pt-[18px]">
        <View className="min-h-[78px] flex-row items-center justify-between gap-5 px-5 pb-3.5 pt-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => handleNavigate("home")}
            className="active:opacity-80"
          >
            <Text className="font-serif text-[22px] font-bold text-pure-green">
              Pure Path
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={menuOpen ? "Close menu" : "Open menu"}
            onPress={() => setMenuOpen((current) => !current)}
            className={cn(
              "h-[46px] w-[46px] items-center justify-center gap-[5px] rounded-full border active:opacity-80",
              menuButtonToneClass,
            )}
          >
            <View className={cn("h-0.5 w-5 rounded-full", menuLineToneClass)} />
            <View className={cn("h-0.5 w-5 rounded-full", menuLineToneClass)} />
            <View className={cn("h-0.5 w-5 rounded-full", menuLineToneClass)} />
          </Pressable>
        </View>

        {menuOpen ? (
          <View className="absolute left-5 right-5 top-full mt-2 gap-2.5 rounded-xl border border-pure-line/90 bg-white/95 px-3 py-3.5 shadow-xl shadow-pure-greenDeep/20 elevation-2xl">
            {menuItems.map((item) => {
              const isActive = activeRoute === item.route;
              const itemToneClass = isActive
                ? "border-pure-green bg-pure-green"
                : "border-[#d9e3df] bg-pure-white";
              const textToneClass = isActive
                ? "text-pure-white"
                : "text-pure-ink";

              return (
                <Pressable
                  key={item.route}
                  accessibilityRole="button"
                  onPress={() => handleNavigate(item.route)}
                  className={cn(
                    "min-h-[46px] flex-row items-center justify-between rounded-lg border px-3.5 active:opacity-80",
                    itemToneClass,
                  )}
                >
                  <Text
                    className={cn("text-base font-extrabold", textToneClass)}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setMenuOpen(false);
                void logout();
              }}
              className="min-h-[46px] flex-row items-center rounded-lg border border-[#d9e3df] bg-pure-white px-3.5 active:opacity-80"
            >
              <Text className="text-base font-extrabold text-pure-ink">
                Logout
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <MobileNavigationContext.Provider value={onNavigate}>
        <View className="flex-1">{children}</View>
      </MobileNavigationContext.Provider>
    </SafeAreaView>
  );
}
