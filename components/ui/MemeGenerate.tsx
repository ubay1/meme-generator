import { Colors } from "@/constants/Colors";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { FontName } from "@/hooks/useFont";
import { useEditorStore } from "@/stores/editor";
import Slider from "@react-native-community/slider";
import { SkColor, Skia } from "@shopify/react-native-skia";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import OutsidePressHandler from "react-native-outside-press";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { captureRef } from "react-native-view-shot";
import DraggableEditor from "./DraggableEditor";
import { styleBottomSheet } from "./styles/meme-generate";
import { ThemedButtonIcon } from "./ThemedButtonIcon";
import { ThemedText } from "./ThemedText";

const MemeGenerate = () => {
  return (
    <>
      <Content />
    </>
  );
};

type IPropsStyle = {
  id: string;
};
const TextStylesSheet = ({ id }: IPropsStyle) => {
  const colorScheme = useColorScheme();
  const items = useEditorStore(
    (state) => state.items.filter((item) => item.id === id)[0]
  );
  const updateTextStyle = useEditorStore((state) => state.updateTextStyle);

  // Initialize local state for font size
  const [localFontSize, setLocalFontSize] = useState(
    items.styles?.fontSize || 12
  );

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
      color: "white",
      colorSkia: Skia.Color("white"),
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
            borderBottomWidth: 0,
          },
        ]}
      >
        <ThemedText type="defaultSemiBold">Font Size</ThemedText>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={8}
          value={items.styles?.fontSize || 12}
          maximumValue={40}
          minimumTrackTintColor="#cdcdcd"
          maximumTrackTintColor="#bbb"
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

const Content = () => {
  const [imageUri, setImageUri] = useState("");

  const { open } = useBottomSheet();
  const viewRef = useRef(null);

  const items = useEditorStore((state) => state.items);
  const addTextEditor = useEditorStore((state) => state.addTextEditor);
  const addImageEditor = useEditorStore((state) => state.addImageEditor);
  const focusedItemId = useEditorStore((state) => state.focusedItemId);
  const setFocusedItem = useEditorStore((state) => state.setFocusedItem);
  const resetItemToCenter = useEditorStore((state) => state.resetItemToCenter);

  /* for debug position x,y canvas & content */
  // const itemTest = useEditorStore(
  //   (state) => state.items.filter((item) => item.id === focusedItemId)[0]
  // );

  const getFocusItemType = () =>
    items.find((item) => item.id === focusedItemId)?.type as "text" | "image";

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
  const pickImageSticker = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      addImageEditor(
        imageUri === "" ? 102 : 111,
        imageUri === "" ? 103 : -334,
        result.assets[0].uri
      );
    }
  };

  const handleOutsidePress = () => {
    setFocusedItem(null); // Hapus fokus dari semua komponen editor
    Keyboard.dismiss(); // Tutup keyboard
  };

  const { width, height } = Dimensions.get("screen");
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  /* for debug position x,y canvas & content */
  // const [trX, setTrX] = useState(0);
  // const [trY, setTrY] = useState(0);

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

      /* for debug position x,y canvas & content */
      // setTrX(translationX.value);
      // setTrY(translationY.value);
      // console.log("translationY = ", translationY.value);
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

  const composedGestures = Gesture.Simultaneous(pan, pinch);

  const composeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    };
  });

  const downloadViewAsImage = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

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
                  backgroundColor:
                    Colors[useColorScheme() || "light"].background2,
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
      </View>
      <GestureHandlerRootView>
        {imageUri !== "" ? (
          <GestureDetector gesture={composedGestures}>
            <Animated.View
              ref={viewRef}
              style={[
                composeStyle,
                {
                  // width: width, // next bisa diatur lebar & tinggi canvasnya
                  // height: width,
                  backgroundColor: "red",
                },
              ]}
            >
              <Animated.Image
                style={[
                  // composeStyle,
                  {
                    width: width, // next bisa diatur lebar & tinggi canvasnya
                    height: width,
                    backgroundColor: "white",
                  },
                ]}
                source={
                  typeof imageUri === "string" ? { uri: imageUri } : imageUri
                }
              ></Animated.Image>
              <OutsidePressHandler
                onOutsidePress={() => {
                  setTimeout(() => {
                    handleOutsidePress();
                  }, 100);
                }}
              >
                <View style={StyleSheet.absoluteFillObject}>
                  {items.map((item) => (
                    <DraggableEditor
                      key={item.id}
                      item={item}
                      isFocused={focusedItemId === item.id}
                    />
                  ))}
                </View>
              </OutsidePressHandler>
            </Animated.View>
          </GestureDetector>
        ) : (
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
              <OutsidePressHandler
                onOutsidePress={() => {
                  setTimeout(() => {
                    handleOutsidePress();
                  }, 100);
                }}
              >
                <View style={StyleSheet.absoluteFillObject}>
                  {items.map((item) => (
                    <DraggableEditor
                      key={item.id}
                      item={item}
                      isFocused={focusedItemId === item.id}
                    />
                  ))}
                </View>
              </OutsidePressHandler>
            </Animated.View>
          </GestureDetector>
        )}
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
        {focusedItemId !== null && getFocusItemType() === "text" && (
          <ThemedButtonIcon
            iconName="creation"
            onPress={() => open(<TextStylesSheet id={focusedItemId} />)}
          />
        )}
        {focusedItemId !== null && getFocusItemType() === "image" && (
          <ThemedButtonIcon
            iconName="image-auto-adjust"
            onPress={() => open(<ImageStylesSheet id={focusedItemId} />)}
          />
        )}
        <ThemedButtonIcon
          iconName="format-text"
          onPress={() =>
            addTextEditor(
              imageUri === "" ? 102 : 111,
              imageUri === "" ? 103 : -334
            )
          }
        />
        <ThemedButtonIcon iconName="image-frame" onPress={pickImageSticker} />
        <ThemedButtonIcon
          iconName="download-circle-outline"
          onPress={downloadViewAsImage}
        />
      </View>

      {/* for debug position x,y canvas & content */}
      {/* <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
          <ThemedText type="default">
            translation x: {Math.round(trX)}
          </ThemedText>
        </Animated.View>
        <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
          <ThemedText type="default">
            translation y: {Math.round(trY)}
          </ThemedText>
        </Animated.View>
      </View>
      {focusedItemId !== null && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
            <ThemedText type="default">x: {itemTest.x}</ThemedText>
          </Animated.View>
          <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
            <ThemedText type="default">y: {itemTest.y}</ThemedText>
          </Animated.View>
          <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
            <ThemedText type="default">height: {itemTest.height}</ThemedText>
          </Animated.View>
        </View>
      )} */}
    </>
  );
};

export default MemeGenerate;
