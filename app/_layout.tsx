import { Colors } from "@/constants/Colors";
import { BottomSheetProvider } from "@/context/BottomSheetContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFontLocal } from "@/hooks/useFont";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { EventProvider } from "react-native-outside-press";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { fontLoaded, fontLoadedError } = useFontLocal();

  useEffect(() => {
    if (fontLoaded || fontLoadedError) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, fontLoadedError]);

  if (!fontLoaded && !fontLoadedError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <BottomSheetProvider>
        <EventProvider>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: Colors[colorScheme || "light"].background2,
            }}
          >
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaView>
        </EventProvider>
      </BottomSheetProvider>
    </ThemeProvider>
  );
}
