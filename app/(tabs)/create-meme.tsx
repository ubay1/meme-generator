import DraggableEditor from "@/components/ui/DraggableTextEditor";
import { ThemedButtonIcon } from "@/components/ui/ThemedButtonIcon";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useEditorStore } from "@/stores/editor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { ClipPath, Defs, Rect } from "react-native-svg";

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const { width, height } = Dimensions.get("screen");

const BottomSheetMainContent = () => {
  const { close } = useBottomSheet();
  const colorScheme = useColorScheme();

  // Ambil actions dari store
  const addTextEditor = useEditorStore((state) => state.addTextEditor);
  const addImageEditor = useEditorStore((state) => state.addImageEditor);
  const clearAllEditors = useEditorStore((state) => state.clearAllEditors);

  const list: {
    iconName: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    action: () => void;
  }[] = [
    {
      iconName: "format-text",
      label: "Teks",
      action: () => {
        addTextEditor();
        close();
      },
    },
    {
      iconName: "image",
      label: "Gambar",
      action: () => {
        addImageEditor();
        close();
      },
    },
    {
      iconName: "trash-can",
      label: "Hapus Semua",
      action: () => {
        Alert.alert(
          "Konfirmasi",
          "Apakah Anda yakin ingin menghapus semua item?",
          [
            {
              text: "Batal",
              style: "cancel",
            },
            {
              text: "Hapus",
              onPress: () => {
                clearAllEditors();
                close();
              },
              style: "destructive",
            },
          ]
        );
      },
    },
  ];

  return (
    <Animated.View>
      <View
        style={[
          bottomSheetStyles.bottomSheetHeader,
          {
            borderBottomColor: Colors[colorScheme || "light"].border,
          },
        ]}
      >
        <ThemedText type="default">Pilihan</ThemedText>
        <ThemedButtonIcon
          iconName="close"
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
              flexDirection: "row", // Gunakan 'flexDirection' bukan 'display' di React Native
              gap: 8,
            }}
            onPress={item.action}
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

  const templatesMeme = [
    { id: 1, img: require("../../assets/images/template1.jpg") },
    { id: 2, img: require("../../assets/images/template2.jpg") },
    { id: 3, img: require("../../assets/images/template3.jpg") },
    { id: 4, img: require("../../assets/images/template4.jpg") },
    { id: 5, img: require("../../assets/images/template5.jpg") },
    { id: 6, img: require("../../assets/images/template6.jpg") },
  ];
  const [template, selectTemplate] = useState<string | any>("blank");

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

  const items = useEditorStore((state) => state.items); // Ganti 'texts' menjadi 'items'
  const focusedItemId = useEditorStore((state) => state.focusedItemId);
  const setFocusedItem = useEditorStore((state) => state.setFocusedItem);

  // Fungsi untuk menangani tap di luar komponen editor
  const handleOutsidePress = () => {
    setFocusedItem(null); // Hapus fokus dari semua komponen editor
    Keyboard.dismiss(); // Tutup keyboard
  };

  return (
    <>
      <View
        style={{
          margin: 10,
        }}
      >
        <ThemedText type="default" style={{ textAlign: "left" }}>
          Template
        </ThemedText>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={() => selectTemplate("blank")}>
                <View
                  style={[
                    styles.header,
                    {
                      backgroundColor:
                        Colors[colorScheme || "light"].background2,
                      borderStyle: "dashed",
                      borderWidth: 2,
                      borderColor: Colors[colorScheme || "light"].text2,
                    },
                  ]}
                >
                  <ThemedText type="default">Blank</ThemedText>
                </View>
              </TouchableOpacity>
              {templatesMeme.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  onPress={() => selectTemplate(template.img)}
                >
                  <Image
                    source={template.img}
                    style={styles.image}
                    alt="image"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={styles.container}>
        <GestureHandlerRootView style={styles.container}>
          <GestureDetector gesture={composedGestures}>
            {template !== "blank" ? (
              <Animated.Image
                source={template}
                style={[
                  composeStyle,
                  {
                    width: 200,
                    height: 200,
                  },
                ]}
                alt="image"
              />
            ) : (
              <Animated.View style={composeStyle}>
                <Svg width={200} height={200}>
                  <Defs>
                    <ClipPath id="clip">
                      <Rect width="100%" height="100%" />
                    </ClipPath>
                  </Defs>

                  {/* Background rectangle */}
                  <Rect
                    width="100%"
                    height="100%"
                    fill="#fff"
                    stroke={Colors[colorScheme || "light"].border}
                    strokeWidth="1"
                  />

                  {/* Area untuk menampung teks dengan clip path */}
                  {/* <ForeignObject
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    // clipPath="url(#clip)"
                  >
                    <View style={{ width: "100%", height: "100%" }}>
                      {items.map((item) => (
                        <DraggableEditor
                          key={item.id}
                          item={item}
                          isFocused={focusedItemId === item.id}
                        />
                      ))}
                    </View>
                  </ForeignObject> */}
                </Svg>
              </Animated.View>
            )}
          </GestureDetector>
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={StyleSheet.absoluteFillObject}>
              {items.map((item) => (
                <DraggableEditor
                  key={item.id}
                  item={item}
                  isFocused={focusedItemId === item.id}
                />
              ))}
            </View>
          </TouchableWithoutFeedback>
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
            iconName="plus"
            onPress={() => open(<BottomSheetMainContent />)}
          />
          <ThemedButtonIcon iconName="palette-outline" />
          <ThemedButtonIcon iconName="download-circle-outline" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: 100,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    objectFit: "fill",
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
