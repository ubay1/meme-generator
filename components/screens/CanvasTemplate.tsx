import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { ThemedText } from "../ui/ThemedText";

type Props = {
  setImageUri: (img: string) => void;
  resetItemToCenter: (x: number, y: number) => void;
};
const CanvasTemplate = ({ setImageUri, resetItemToCenter }: Props) => {
  const templatesMeme = [
    { id: 1, img: require("../../assets/images/template1.jpg") },
    { id: 2, img: require("../../assets/images/template2.jpg") },
    { id: 3, img: require("../../assets/images/template3.jpg") },
    { id: 4, img: require("../../assets/images/template4.jpg") },
    { id: 5, img: require("../../assets/images/template5.jpg") },
    { id: 6, img: require("../../assets/images/template6.jpg") },
  ];

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      resetItemToCenter(111, -334);
    }
  };

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          onPress={() => {
            setImageUri("");
            resetItemToCenter(102, 103);
          }}
        >
          <View
            style={[
              {
                width: 100,
                height: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  Colors[useColorScheme() || "light"].background2,
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: Colors[useColorScheme() || "light"].text2,
              },
            ]}
          >
            <ThemedText type="default">Blank</ThemedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage}>
          <View
            style={{
              height: 100,
              width: 100,
              paddingHorizontal: 10,
              backgroundColor: Colors[useColorScheme() || "light"].background2,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: Colors[useColorScheme() || "light"].text2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/gallery.png")}
              width={20}
              height={20}
              style={{ width: 40, height: 40 }}
            />
            <ThemedText type="default">Gallery</ThemedText>
          </View>
        </TouchableOpacity>
        {templatesMeme.map((template) => (
          <TouchableOpacity
            key={template.id}
            onPress={() => {
              setImageUri(template.img);
              resetItemToCenter(111, -334);
            }}
          >
            <Animated.Image
              source={template.img}
              style={{ width: 100, height: 100 }}
              alt="image"
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default CanvasTemplate;
