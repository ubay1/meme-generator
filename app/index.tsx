import CanvasMain from "@/components/screens/CanvasMain";
import { ThemedView } from "@/components/ui/ThemedView";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.titleContainer}>
      <CanvasMain />
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
