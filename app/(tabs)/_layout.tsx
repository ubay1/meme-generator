import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme || "light"].text2,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            height: 60,
            paddingBottom: 10,
            paddingTop: 5,
          },
          android: {
            height: 60,
            paddingBottom: 10,
            paddingTop: 5,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={20} name="house" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-meme"
        options={{
          title: "Buat Meme",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={20} name="plus.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
