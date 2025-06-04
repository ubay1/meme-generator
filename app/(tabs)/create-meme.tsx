import { IconSymbolName } from "@/components/ui/IconSymbol";
import { ThemedButtonIcon } from "@/components/ui/ThemedButtonIcon";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const { width, height } = Dimensions.get("screen");

const BottomSheetMainContent = () => {
  const { close } = useBottomSheet();
  const colorScheme = useColorScheme();
  const list: { iconName: IconSymbolName; label: string }[] = [
    {
      iconName: "text.page",
      label: "Teks",
    },
    {
      iconName: "apple.image.playground",
      label: "Gambar",
    },
    {
      iconName: "trash.fill",
      label: "Hapus Semua",
    },
  ];

  return (
    <Animated.View>
      <View
        style={[
          bottomSheetStyles.bottomSheetHeader,
          {
            borderBottomColor: Colors[colorScheme || "light"].border,
            // borderBottomWidth: 1,
          },
        ]}
      >
        <ThemedText type="default">Pilihan</ThemedText>
        <ThemedButtonIcon
          iconName="x.circle.fill"
          style={{ borderWidth: 0 }}
          onPress={() => close()}
        ></ThemedButtonIcon>
      </View>
      <View style={[bottomSheetStyles.bottomSheetContent]}>
        {list.map((item) => (
          <ThemedButtonIcon
            key={item.label}
            iconName={item.iconName}
            label={item.label}
            style={{
              borderWidth: 0,
              display: "flex",
              flexDirection: "row",
              gap: 8,
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
};

export default function CreateMeme() {
  const colorScheme = useColorScheme();
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  const { open } = useBottomSheet();

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 50;
      const maxTranslateY = height / 2 - 50;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .runOnJS(true);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.5,
        Math.min(width / 100, height / 100)
      );
    })
    .runOnJS(true);

  const composeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    };
  });

  const composedGestures = Gesture.Simultaneous(pan, pinch);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <GestureDetector gesture={composedGestures}>
          <Animated.View
            style={[
              composeStyle,
              {
                width: 200,
                height: 200,
                backgroundColor: Colors[colorScheme || "light"].background2,
                borderColor: Colors[colorScheme || "light"].border,
                borderWidth: 1,
                borderRadius: 0,
              },
            ]}
          ></Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
      <View
        style={{
          marginVertical: 10,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ThemedButtonIcon
          iconName="plus.app"
          label="Tambah"
          onPress={() => open(<BottomSheetMainContent />)}
        />
        <ThemedButtonIcon iconName="paintpalette" label="Styles" />
        <ThemedButtonIcon iconName="0.square" label="Export" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
const bottomSheetStyles = StyleSheet.create({
  bottomSheetHeader: {
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  bottomSheetContent: {
    padding: 16,
    display: "flex",
    gap: 14,
  },
});
