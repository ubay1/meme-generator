import { Colors } from "@/constants/Colors";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { useEditorStore } from "@/stores/editor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Canvas, Image, useImage } from "@shopify/react-native-skia";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  Image as ImageRN,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { captureRef } from "react-native-view-shot";
import DraggableEditor from "./DraggableTextEditor";
import { ThemedButtonIcon } from "./ThemedButtonIcon";
import { ThemedText } from "./ThemedText";

const LearnSkia = () => {
  return (
    <>
      <ImageSkia />
    </>
  );
};

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

const ImageSkia = () => {
  const [imageUri, setImageUri] = useState("");
  const image = useImage(imageUri || "");
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const viewRef = useRef(null);

  const { width, height } = Dimensions.get("screen");
  const CONTAINER_SIZE = width - 100;
  const CANVAS_SIZE = 100;
  const maxTranslateX = CONTAINER_SIZE - CANVAS_SIZE;
  const maxTranslateY = CONTAINER_SIZE - CANVAS_SIZE;
  const initialOffset = (CONTAINER_SIZE - CANVAS_SIZE) / 2;
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);
  const translationX2 = useSharedValue(initialOffset);
  const translationY2 = useSharedValue(initialOffset);
  const prevTranslationX2 = useSharedValue(0);
  const prevTranslationY2 = useSharedValue(0);
  const scale2 = useSharedValue(1);
  const startScale2 = useSharedValue(0);

  const templatesMeme = [
    { id: 1, img: require("../../assets/images/template1.jpg") },
    { id: 2, img: require("../../assets/images/template2.jpg") },
    { id: 3, img: require("../../assets/images/template3.jpg") },
    { id: 4, img: require("../../assets/images/template4.jpg") },
    { id: 5, img: require("../../assets/images/template5.jpg") },
    { id: 6, img: require("../../assets/images/template6.jpg") },
  ];
  const [template, selectTemplate] = useState<string | any>("blank");

  const pan = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        0,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        0,
        maxTranslateY
      );
    })
    .runOnJS(true);

  const pan2 = Gesture.Pan()
    .onStart(() => {
      prevTranslationX2.value = translationX2.value;
      prevTranslationY2.value = translationY2.value;
    })
    .onUpdate((event) => {
      translationX2.value = clamp(
        prevTranslationX2.value + event.translationX,
        0,
        maxTranslateX
      );
      translationY2.value = clamp(
        prevTranslationY2.value + event.translationY,
        0,
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
  const pinch2 = Gesture.Pinch()
    .onStart(() => {
      startScale2.value = scale2.value;
    })
    .onUpdate((event) => {
      scale2.value = clamp(
        startScale2.value * event.scale,
        0.5,
        Math.min(width / 100, height / 100)
      );
      scale.value = clamp(
        startScale.value * event.scale,
        0.5,
        Math.min(width / 100, height / 100)
      );
    })
    .runOnJS(true);

  const composedGestures = Gesture.Simultaneous(pan, pinch);
  const composedGestures2 = Gesture.Simultaneous(pan2, pinch2);

  const composeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    };
  });
  const composeStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX2.value },
        { translateY: translationY2.value },
        { scale: scale2.value },
      ],
    };
  });
  const panStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
    };
  });
  const panStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX2.value },
        { translateY: translationY2.value },
      ],
    };
  });
  const pinchStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const downloadViewAsImage = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      console.log("Captured URI:", uri);

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        await MediaLibrary.saveToLibraryAsync(uri);
        alert("Image saved to gallery!");
      }
    } catch (err) {
      console.error("Capture failed:", err);
    }
  };

  const items = useEditorStore((state) => state.items); // Ganti 'texts' menjadi 'items'
  const addTextEditor = useEditorStore((state) => state.addTextEditor);
  const addImageEditor = useEditorStore((state) => state.addImageEditor);
  const clearAllEditors = useEditorStore((state) => state.clearAllEditors);
  const focusedItemId = useEditorStore((state) => state.focusedItemId);
  const setFocusedItem = useEditorStore((state) => state.setFocusedItem);
  const handleOutsidePress = () => {
    setFocusedItem(null); // Hapus fokus dari semua komponen editor
    Keyboard.dismiss(); // Tutup keyboard
  };

  return (
    <>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <View
        style={{ flexDirection: "row", paddingHorizontal: 10, marginTop: 10 }}
      >
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => {
                selectTemplate("blank");
                setImageUri("");
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
            {templatesMeme.map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => {
                  selectTemplate(template.img);
                  setImageUri(template.img);
                }}
              >
                <ImageRN
                  source={template.img}
                  style={{ width: 100, height: 100 }}
                  alt="image"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <GestureHandlerRootView>
        <GestureDetector gesture={composedGestures}>
          <Animated.View
            ref={viewRef}
            // collapsable={false}
            style={[
              composeStyle,
              {
                width: width,
                height: width,
                backgroundColor: "white",
              },
            ]}
          >
            <GestureDetector gesture={pan2}>
              <Animated.View style={[panStyle2]}>
                {imageUri !== "" ? (
                  <Canvas
                    style={[
                      {
                        width: width - 100,
                        height: width - 100,
                        // backgroundColor: "red",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Image
                      image={image}
                      fit="contain"
                      x={0}
                      y={0}
                      width={width - 100}
                      height={width - 100}
                    />
                  </Canvas>
                ) : (
                  <View></View>
                )}

                <TouchableWithoutFeedback onPress={() => handleOutsidePress()}>
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
              </Animated.View>
            </GestureDetector>
          </Animated.View>
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
        {/* <ThemedButtonIcon
          iconName="plus"
          onPress={() => open(<BottomSheetMainContent />)}
        /> */}
        <ThemedButtonIcon iconName="format-text" onPress={addTextEditor} />
        <ThemedButtonIcon
          iconName="download-circle-outline"
          onPress={downloadViewAsImage}
        />
      </View>
    </>
  );
};

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

export default LearnSkia;
