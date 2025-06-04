import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/ui/HelloWave";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#000", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/hero2.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ textAlign: "center" }}>
          Selamat Datang di meme generator <HelloWave />
        </ThemedText>
        <ThemedText type="default" style={{ marginTop: 10 }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam qui quis
          mollitia eaque error illum, ipsa voluptatum temporibus ducimus nisi
          exercitationem inventore dolores ut alias aut corporis, quasi
          laboriosam fuga? Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Nesciunt, voluptatibus. Error quisquam facilis libero sit harum.
          Placeat cum enim impedit a. Blanditiis quam saepe iure aut expedita.
          Quibusdam, architecto dicta! Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Nesciunt, voluptatibus. Error quisquam facilis
          libero sit harum. Placeat cum enim impedit a. Blanditiis quam saepe
          iure aut expedita. Quibusdam, architecto dicta! Lorem, ipsum dolor sit
          amet consectetur adipisicing elit. Nesciunt, voluptatibus. Error
          quisquam facilis libero sit harum. Placeat cum enim impedit a.
          Blanditiis quam saepe iure aut expedita. Quibusdam, architecto dicta!
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt,
          voluptatibus. Error quisquam facilis libero sit harum. Placeat cum
          enim impedit a. Blanditiis quam saepe iure aut expedita. Quibusdam,
          architecto dicta! Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Nesciunt, voluptatibus. Error quisquam facilis libero sit harum.
          Placeat cum enim impedit a. Blanditiis quam saepe iure aut expedita.
          Quibusdam, architecto dicta!
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
  },
});
