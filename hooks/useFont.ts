import { useFonts } from "expo-font";

// prettier-ignore
export type FontName = 'SpaceMono' | 'Barrio' | 'EduSAHand' | 'Inter' | 'Montserrat' | 'RobotoCondensed' | 'RobotoSlab' | 'BethanyAvanue' | 'BlMindfuck' | 'Braniella' | 'ChillingNightime' | 'CyberBrush' | 'Glinka' | 'Inktopia' | 'KingRimba' | 'MorallySerif' | 'OBITRUKTrial' | 'SimpleDiary' | 'SuperAdorable' | 'Tamira' | 'TheGoodfather'

export function useFontLocal() {

  const [fontLoaded, fontLoadedError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Barrio: require("../assets/fonts/Barrio-Regular.ttf"),
    EduSAHand: require("../assets/fonts/EduSAHand-Medium.ttf"),
    Inter: require("../assets/fonts/Inter_18pt-Medium.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Medium.ttf"),
    RobotoCondensed: require("../assets/fonts/Roboto_Condensed-Regular.ttf"),
    RobotoSlab: require("../assets/fonts/RobotoSlab-Medium.ttf"),
    BethanyAvanue: require("../assets/fonts/BethanyAvanue.otf"),
    BlMindfuck: require("../assets/fonts/BlMindfuck-Regular.ttf"),
    Braniella: require("../assets/fonts/Braniella.ttf"),
    ChillingNightime: require("../assets/fonts/ChillingNightime.ttf"),
    CyberBrush: require("../assets/fonts/CyberBrush.ttf"),
    Glinka: require("../assets/fonts/Glinka.ttf"),
    Inktopia: require("../assets/fonts/Inktopia.otf"),
    KingRimba: require("../assets/fonts/KingRimba.ttf"),
    MorallySerif: require("../assets/fonts/MorallySerif.otf"),
    OBITRUKTrial: require("../assets/fonts/OBITRUKTrial.ttf"),
    SimpleDiary: require("../assets/fonts/SimpleDiary.otf"),
    SuperAdorable: require("../assets/fonts/SuperAdorable.ttf"),
    Tamira: require("../assets/fonts/Tamira.ttf"),
    TheGoodfather: require("../assets/fonts/TheGoodfather.otf"),
  });

  return {
    fontLoaded,
    fontLoadedError
  }
}
