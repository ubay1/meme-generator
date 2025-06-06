import { Colors } from "@/constants/Colors";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { FontName } from "@/hooks/useFont";
import { useEditorStore } from "@/stores/editor";
import Slider from "@react-native-community/slider";
import {
  Canvas,
  Image,
  SkColor,
  Skia,
  useImage,
} from "@shopify/react-native-skia";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
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
  runOnJS,
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

type IPropsTextStyle = {
  id: string;
};
const TextStylesSheet = ({ id }: IPropsTextStyle) => {
  // const { close } = useBottomSheet();
  const colorScheme = useColorScheme();
  const items = useEditorStore(
    (state) => state.items.filter((item) => item.id === id)[0]
  );
  const updateTextStyle = useEditorStore((state) => state.updateTextStyle);

  // Initialize local state for font size
  const [localFontSize, setLocalFontSize] = useState(
    items.styles?.fontSize || 12
  );
  // const [localFontName, setLocalFontName] = useState(
  //   items.styles?.font?.[0] || "SpaceMono"
  // );
  // useEffect(() => {
  //   // if (items.styles?.font !== undefined) {
  //   setLocalFontName(items.styles?.font?.[0] as string);
  //   // }
  // }, [items.styles?.font]);

  // Effect to synchronize local state with store when 'items' changes (e.g., if another component updates it)
  // This is crucial to ensure the slider reflects the correct initial value or external changes.
  useEffect(() => {
    if (items.styles?.fontSize !== undefined) {
      setLocalFontSize(items.styles.fontSize);
    }
  }, [items.styles?.fontSize]);

  const listFont: { label: string; fontName: FontName }[] = [
    { label: "Barrio", fontName: "Barrio" },
    { label: "EduSAHand", fontName: "EduSAHand" },
    { label: "Inter", fontName: "Inter" },
    { label: "Montserrat", fontName: "Montserrat" },
    { label: "RobotoCondensed", fontName: "RobotoCondensed" },
    { label: "RobotoSlab", fontName: "RobotoSlab" },
    { label: "SpaceMono", fontName: "SpaceMono" },
  ];

  const listColor = [
    {
      color: "black",
      colorSkia: Skia.Color("black"),
    },
    {
      color: "red",
      colorSkia: Skia.Color("red"),
    },
    {
      color: "yellow",
      colorSkia: Skia.Color("yellow"),
    },
    {
      color: "green",
      colorSkia: Skia.Color("green"),
    },
    {
      color: "blue",
      colorSkia: Skia.Color("blue"),
    },
    {
      color: "orange",
      colorSkia: Skia.Color("orange"),
    },
  ];

  // Helper function to update font styles in the store
  const handleUpdateFont = (fontName: FontName) => {
    updateTextStyle(items.id, {
      ...items.styles,
      font: [fontName], // Assuming font is an array of strings
      color: items.styles?.color || Skia.Color("black"), // Keep existing color or default
      fontSize: localFontSize, // Use the current local font size
    });
  };

  // Helper function to update color styles in the store
  const handleUpdateColor = (colorSkia: SkColor, colorRaw: string) => {
    updateTextStyle(items.id, {
      ...items.styles,
      color: colorSkia,
      colorRaw: colorRaw,
      fontSize: localFontSize, // Use the current local font size
    });
  };

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
        <ThemedText type="subtitle">Text styles</ThemedText>
      </View>

      <View
        style={[
          styleBottomSheet.container,
          { borderBottomColor: Colors[colorScheme || "light"].border },
        ]}
      >
        <ThemedText type="defaultSemiBold">Font</ThemedText>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {listFont.map((font) => (
            <TouchableOpacity
              key={font.label}
              style={{
                padding: 2,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderColor: Colors[colorScheme || "light"].text2,
                borderWidth: items.styles?.font?.[0] === font.fontName ? 1 : 0,
              }}
            >
              <ThemedText
                type="default"
                style={{ fontSize: 12, fontFamily: font.fontName }}
                onPress={() => handleUpdateFont(font.fontName)}
              >
                {font.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View
        style={[
          styleBottomSheet.container,
          { borderBottomColor: Colors[colorScheme || "light"].border },
        ]}
      >
        <ThemedText type="defaultSemiBold">Color</ThemedText>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {listColor.map((color) => (
            <TouchableOpacity
              key={color.color}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: color.color,
                borderWidth: items.styles?.colorRaw === color.color ? 1 : 0,
                borderColor:
                  colorScheme === "dark" &&
                  items.styles?.colorRaw === color.color
                    ? "white"
                    : "black",
              }}
              onPress={() => handleUpdateColor(color.colorSkia, color.color)}
            ></TouchableOpacity>
          ))}
        </View>
      </View>

      <View
        style={[
          styleBottomSheet.container,
          {
            paddingBottom: 30,
            borderBottomColor: Colors[colorScheme || "light"].border,
          },
        ]}
      >
        <ThemedText type="defaultSemiBold">Font Size</ThemedText>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={8}
          value={items.styles?.fontSize || 12}
          maximumValue={40}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          step={1}
          onValueChange={(value) => {
            setLocalFontSize(value);
          }}
          onSlidingComplete={(value) => {
            updateTextStyle(items.id, {
              ...items.styles,
              fontSize: value,
              color: items.styles?.color || Skia.Color("black"),
              font: items.styles?.font || ["SpaceMono"],
              colorRaw: items.styles?.colorRaw || "black", // Maintain colorRaw if needed
            });
          }}
        />
        <ThemedText type="defaultSemiBold">
          {Math.round(localFontSize)}
        </ThemedText>
      </View>
    </ScrollView>
  );
};

const styleBottomSheet = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flexDirection: "column",
    gap: 4,
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
});

const ImageSkia = () => {
  const [imageUri, setImageUri] = useState("");
  const image = useImage(imageUri || "");
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const { open } = useBottomSheet();
  const viewRef = useRef(null);

  const items = useEditorStore((state) => state.items);
  const addTextEditor = useEditorStore((state) => state.addTextEditor);
  const focusedItemId = useEditorStore((state) => state.focusedItemId);
  const setFocusedItem = useEditorStore((state) => state.setFocusedItem);
  const handleOutsidePress = () => {
    setFocusedItem(null); // Hapus fokus dari semua komponen editor
    Keyboard.dismiss(); // Tutup keyboard
  };

  const { width, height } = Dimensions.get("screen");
  const CONTAINER_SIZE = width - 100;
  const CANVAS_SIZE = 100; // max 260
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
  // const scale2 = useSharedValue(1);
  // const startScale2 = useSharedValue(0);

  const templatesMeme = [
    { id: 1, img: require("../../assets/images/template1.jpg") },
    { id: 2, img: require("../../assets/images/template2.jpg") },
    { id: 3, img: require("../../assets/images/template3.jpg") },
    { id: 4, img: require("../../assets/images/template4.jpg") },
    { id: 5, img: require("../../assets/images/template5.jpg") },
    { id: 6, img: require("../../assets/images/template6.jpg") },
  ];

  const pan = Gesture.Pan()
    // .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 110;
      const maxTranslateY = height / 2 - 150;

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
  // const pinch2 = Gesture.Pinch()
  //   .onStart(() => {
  //     startScale2.value = scale2.value;
  //   })
  //   .onUpdate((event) => {
  //     scale2.value = clamp(
  //       startScale2.value * event.scale,
  //       0.5,
  //       Math.min(width / 100, height / 100)
  //     );
  //     scale.value = clamp(
  //       startScale.value * event.scale,
  //       0.5,
  //       Math.min(width / 100, height / 100)
  //     );
  //   })
  //   .runOnJS(true);
  const clearFocus = useCallback(() => {
    setFocusedItem(null);
    Keyboard.dismiss(); // Keyboard.dismiss is generally safe to call directly
  }, [setFocusedItem]); // Depend on setFocusedItem

  const canvasTapGesture = Gesture.Tap().onEnd(() => {
    if (focusedItemId !== null) {
      runOnJS(clearFocus)(); // Call the wrapped function
    }
  });

  const composedGestures = Gesture.Simultaneous(pan, pinch, canvasTapGesture);
  // const composedGestures2 = Gesture.Simultaneous(pan2, pinch2);

  const composeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
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

  return (
    <>
      <View
        style={{ flexDirection: "row", paddingHorizontal: 10, marginTop: 10 }}
      >
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => {
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
            style={[
              composeStyle,
              {
                width: width, // next bisa diatur lebar & tinggi canvasnya
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
        <ThemedButtonIcon iconName="image" onPress={pickImage} />
        {focusedItemId !== null && (
          <ThemedButtonIcon
            iconName="creation"
            onPress={() => open(<TextStylesSheet id={focusedItemId} />)}
          />
        )}
        <ThemedButtonIcon iconName="format-text" onPress={addTextEditor} />
        <ThemedButtonIcon
          iconName="download-circle-outline"
          onPress={downloadViewAsImage}
        />
      </View>
    </>
  );
};

export default LearnSkia;
