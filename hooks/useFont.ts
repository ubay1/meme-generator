import { useFonts } from "expo-font";

export type FontName = 'SpaceMono' | 'Barrio' | 'EduSAHand' | 'Inter' | 'Montserrat' | 'RobotoCondensed' | 'RobotoSlab'

export function useFontLocal() {

  const [fontLoaded, fontLoadedError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Barrio: require("../assets/fonts/Barrio-Regular.ttf"),
    EduSAHand: require("../assets/fonts/EduSAHand-Medium.ttf"),
    Inter: require("../assets/fonts/Inter_18pt-Medium.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Medium.ttf"),
    RobotoCondensed: require("../assets/fonts/Roboto_Condensed-Regular.ttf"),
    RobotoSlab: require("../assets/fonts/RobotoSlab-Medium.ttf"),
  });

  return {
    fontLoaded,
    fontLoadedError
  }
}
