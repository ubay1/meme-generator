import { useBottomSheet } from "@/context/BottomSheetContext";
import { useEditorStore } from "@/stores/editor";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import React, { useRef, useState } from "react";
import { Dimensions, Keyboard, StyleSheet, View } from "react-native";
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
import DraggableEditorV3 from "../ui/DraggableEditorV2";
import GuideLines from "../ui/GuideLines";
import { ThemedButtonIcon } from "../ui/ThemedButtonIcon";
import CanvasTemplate from "./CanvasTemplate";
import ImageStylesSheet from "./ImageStylesSheet";
import TextStylesSheet from "./TextStylesSheet";

const CanvasMain = () => {
  return (
    <>
      <Content />
    </>
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
        <CanvasTemplate
          resetItemToCenter={(value1, value2) =>
            resetItemToCenter(value1, value2)
          }
          setImageUri={(value) => setImageUri(value)}
        />
      </View>
      <GestureHandlerRootView>
        {imageUri !== "" ? (
          <GestureDetector gesture={composedGestures}>
            <Animated.View
              ref={viewRef}
              style={[
                composeStyle,
                {
                  width: width,
                  height: width,
                  backgroundColor: "white",
                },
              ]}
            >
              <Animated.Image
                style={[
                  {
                    width: width,
                    height: width,
                  },
                ]}
                source={
                  typeof imageUri === "string" ? { uri: imageUri } : imageUri
                }
              ></Animated.Image>

              {focusedItemId && <GuideLines wCanvas={width} hCanvas={width} />}

              <OutsidePressHandler
                onOutsidePress={() => {
                  setTimeout(() => {
                    handleOutsidePress();
                  }, 100);
                }}
              >
                <View style={StyleSheet.absoluteFillObject}>
                  {items.map((item) => (
                    <DraggableEditorV3
                      key={item.id}
                      item={item}
                      isFocused={focusedItemId === item.id}
                      hCanvas={width}
                      wCanvas={width}
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
                  width: width,
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
                  {focusedItemId && (
                    <GuideLines wCanvas={width} hCanvas={width} />
                  )}
                  {items.map((item) => (
                    <DraggableEditorV3
                      key={item.id}
                      item={item}
                      isFocused={focusedItemId === item.id}
                      hCanvas={width}
                      wCanvas={width}
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
          disabled={focusedItemId !== null}
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
          <ThemedText type="default">x: {Math.round(trX)}</ThemedText>
        </Animated.View>
        <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
          <ThemedText type="default">y: {Math.round(trY)}</ThemedText>
        </Animated.View>

        <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
          <ThemedText type="default">h: {Math.round(height)}</ThemedText>
        </Animated.View>
        <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
          <ThemedText type="default">w: {Math.round(width)}</ThemedText>
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
            <ThemedText type="default">x: {Math.round(itemTest.x)}</ThemedText>
          </Animated.View>
          <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
            <ThemedText type="default">y: {Math.round(itemTest.y)}</ThemedText>
          </Animated.View>
          <Animated.View style={{ padding: 6, backgroundColor: "darkred" }}>
            <ThemedText type="default">
              h: {Math.round(itemTest.height)}
            </ThemedText>
          </Animated.View>
        </View>
      )} */}
    </>
  );
};

export default CanvasMain;
