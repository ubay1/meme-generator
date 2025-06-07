import { StyleSheet } from "react-native";

import MemeGenerate from "@/components/ui/MemeGenerate";
import { ThemedView } from "@/components/ui/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.titleContainer}>
      <MemeGenerate />
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
