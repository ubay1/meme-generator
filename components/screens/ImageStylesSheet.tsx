import { useEditorStore } from "@/stores/editor";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { styleBottomSheet } from "../styles/meme-generate";
import { ThemedText } from "../ui/ThemedText";

type IPropsStyle = {
  id: string;
};
const ImageStylesSheet = ({ id }: IPropsStyle) => {
  const items = useEditorStore(
    (state) => state.items.filter((item) => item.id === id)[0]
  );
  const updateImageStyle = useEditorStore((state) => state.updateImageStyle);
  // Initialize local state for font size
  const [opacity, setOpacity] = useState(items.imageStyles?.opacity || 1);
  const [borderRadius, setBorderRadius] = useState(
    items.imageStyles?.borderRadius || 1
  );

  useEffect(() => {
    if (items.imageStyles?.opacity !== undefined) {
      setOpacity(items.imageStyles.opacity);
    }
  }, [items.imageStyles?.opacity]);
  useEffect(() => {
    if (items.imageStyles?.borderRadius !== undefined) {
      setBorderRadius(items.imageStyles.borderRadius);
    }
  }, [items.imageStyles?.borderRadius]);

  return (
    <ScrollView style={{ padding: 10, maxHeight: 400 }}>
      <View
        style={{
          marginVertical: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText type="subtitle">Image styles</ThemedText>
      </View>

      <View
        style={[
          styleBottomSheet.container,
          {
            paddingBottom: 30,
            borderBottomWidth: 0,
          },
        ]}
      >
        <ThemedText type="defaultSemiBold">Opacity</ThemedText>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0.1}
          value={items.imageStyles?.opacity || 1}
          maximumValue={1}
          minimumTrackTintColor="#cdcdcd"
          maximumTrackTintColor="#bbb"
          onValueChange={(value) => {
            setOpacity(value);
          }}
          onSlidingComplete={(value) => {
            updateImageStyle(items.id, {
              ...items.imageStyles,
              opacity: value,
            });
          }}
        />
        <ThemedText type="defaultSemiBold">{opacity.toFixed(1)}</ThemedText>
      </View>
      <View
        style={[
          styleBottomSheet.container,
          {
            paddingBottom: 30,
            borderBottomWidth: 0,
          },
        ]}
      >
        <ThemedText type="defaultSemiBold">Border Radius</ThemedText>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          value={items.imageStyles?.borderRadius || 0}
          maximumValue={100}
          step={1}
          minimumTrackTintColor="#cdcdcd"
          maximumTrackTintColor="#bbb"
          onValueChange={(value) => {
            setBorderRadius(value);
          }}
          onSlidingComplete={(value) => {
            updateImageStyle(items.id, {
              ...items.imageStyles,
              borderRadius: value || 0,
            });
          }}
        />
        <ThemedText type="defaultSemiBold">
          {Math.round(borderRadius)}
        </ThemedText>
      </View>
    </ScrollView>
  );
};

export default ImageStylesSheet;
