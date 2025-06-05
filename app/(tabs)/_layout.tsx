// import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    // <BottomSheetProvider>
    {
      /* <Tabs
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
              <Feather size={20} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create-meme"
          options={{
            title: "Buat Meme",
            tabBarIcon: ({ color }) => (
              <Feather size={20} name="plus-circle" color={color} />
            ),
          }}
        />
      </Tabs> */
    }
    // </BottomSheetProvider>
  );
}
