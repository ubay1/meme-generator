import { StyleSheet } from "react-native";

import LearnSkia from "@/components/ui/MemeGenerate";
import { ThemedView } from "@/components/ui/ThemedView";

export default function HomeScreen() {
  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: "#000", dark: "#1D3D47" }}
    //   headerImage={
    //     <Image
    //       source={require("@/assets/images/hero2.jpg")}
    //       style={styles.reactLogo}
    //     />
    //   }
    // >
    <ThemedView style={styles.titleContainer}>
      {/* <ThemedText type="title" style={{ textAlign: "center" }}>
          Selamat Datang di meme generator <HelloWave />
        </ThemedText> */}
      <LearnSkia />
    </ThemedView>
    // </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "lightgrey",
    gap: 8,
    flex: 1,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
  },
});
