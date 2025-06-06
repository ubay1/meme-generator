import { StyleSheet } from "react-native";

import MemeGenerate2 from "@/components/ui/MemeGenerate2";
import { ThemedView } from "@/components/ui/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.titleContainer}>
      {/* <LearnSkia /> */}
      <MemeGenerate2 />
    </ThemedView>
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
