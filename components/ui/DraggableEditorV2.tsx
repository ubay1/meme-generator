import { EditorItem, useEditorStore } from "@/stores/editor";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import {
  Canvas,
  Paragraph as ParagrafSkia,
  SkColor,
  Skia,
  SkTextStyle,
  TextAlign,
  useFonts,
} from "@shopify/react-native-skia";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { styles } from "../styles/draggle-editor";

const MIN_HEIGHT = 50;
const MIN_WIDTH = 50;

export interface PropsCanvas {
  hCanvas?: number; // Height of the canvas
  wCanvas?: number; // Width of the canvas
}
interface Props extends PropsCanvas {
  item: EditorItem;
  isFocused: boolean;
}

const DraggableEditorV2 = ({ item, isFocused, hCanvas, wCanvas }: Props) => {
  const deleteEditor = useEditorStore((state) => state.deleteEditor);
  const copyEditor = useEditorStore((state) => state.copyEditor);
  const updateTextContent = useEditorStore((state) => state.updateTextContent);
  const updateItemTransform = useEditorStore(
    (state) => state.updateItemTransform
  );
  const updateItemSize = useEditorStore((state) => state.updateItemSize);
  const setFocusedItem = useEditorStore((state) => state.setFocusedItem);
  const setHorizontalGuide = useEditorStore(
    (state) => state.setHorizontalGuide
  );
  const setVerticalGuide = useEditorStore((state) => state.setVerticalGuide);

  const translateX = useSharedValue(item.x);
  const translateY = useSharedValue(item.y);
  const scale = useSharedValue(item.scale);
  const rotation = useSharedValue(item.rotation);

  const currentWidth = useSharedValue(item.width);
  const currentHeight = useSharedValue(item.height);

  const savedTranslateX = useSharedValue(item.x);
  const savedTranslateY = useSharedValue(item.y);
  const savedScale = useSharedValue(item.scale);
  const savedRotation = useSharedValue(item.rotation);

  const savedWidth = useSharedValue(item.width);
  const savedHeight = useSharedValue(item.height);
  const savedOriginalX = useSharedValue(item.x);
  const savedOriginalY = useSharedValue(item.y);

  const [isEditing, setIsEditing] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false); // New state to indicate snapping

  useEffect(() => {
    translateX.value = item.x;
    translateY.value = item.y;
    scale.value = item.scale;
    rotation.value = item.rotation;
    currentWidth.value = item.width;
    currentHeight.value = item.height;

    savedTranslateX.value = item.x;
    savedTranslateY.value = item.y;
    savedScale.value = item.scale;
    savedRotation.value = item.rotation;
    savedWidth.value = item.width;
    savedHeight.value = item.height;
    savedOriginalX.value = item.x;
    savedOriginalY.value = item.y;
  }, [
    item.x,
    item.y,
    item.scale,
    item.rotation,
    item.width,
    item.height,
    translateX,
    translateY,
    scale,
    rotation,
    currentWidth,
    currentHeight,
    savedTranslateX,
    savedTranslateY,
    savedScale,
    savedRotation,
    savedWidth,
    savedHeight,
    savedOriginalX,
    savedOriginalY,
  ]);

  const saveTransformToStore = () => {
    updateItemTransform(
      item.id,
      translateX.value,
      translateY.value,
      scale.value,
      rotation.value
    );
  };

  const saveSizeToStore = (
    newX: number,
    newY: number,
    newWidth: number,
    newHeight: number
  ) => {
    updateItemSize(item.id, newWidth, newHeight, newX, newY);
  };

  // --- Gestures ---

  // Pan Gesture (untuk memindahkan item)
  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setFocusedItem)(item.id);
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(setIsSnapping)(false); // Reset snapping state on start
    })
    .onUpdate((event) => {
      const newX = savedTranslateX.value + event.translationX;
      const newY = savedTranslateY.value + event.translationY;

      translateX.value = newX;
      translateY.value = newY;

      const elementCenterX = newX + currentWidth.value / 2;
      const elementCenterY = newY + currentHeight.value / 2;

      const tolerance = 10;

      if (wCanvas && Math.abs(elementCenterX - wCanvas / 2) < tolerance) {
        runOnJS(setVerticalGuide)(true);
      } else {
        runOnJS(setVerticalGuide)(false);
      }

      // kondisi pertama ketika canvas menggunakan gambar
      // kondisi kedua ketika canvas tanpa gambar
      if (
        (hCanvas &&
          Math.abs(elementCenterY - hCanvas / 2) > 330 &&
          Math.abs(elementCenterY - hCanvas / 2) < 380) ||
        (hCanvas && Math.abs(elementCenterY - hCanvas / 2) < tolerance)
      ) {
        runOnJS(setHorizontalGuide)(true);
      } else {
        runOnJS(setHorizontalGuide)(false);
      }
    })
    .onEnd(() => {
      runOnJS(saveTransformToStore)();
    });

  // Pinch Gesture (untuk menskala item)
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      runOnJS(setFocusedItem)(item.id);
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(scale.value);
      runOnJS(saveTransformToStore)();
    });

  // Rotation Gesture (untuk merotasi item)
  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      runOnJS(setFocusedItem)(item.id);
      savedRotation.value = rotation.value;
    })
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      rotation.value = withSpring(rotation.value);
      runOnJS(saveTransformToStore)();
    });

  // Tap gesture (untuk fokus dan editing teks)
  const tapGesture = Gesture.Tap().onEnd((event, success) => {
    if (success) {
      runOnJS(setFocusedItem)(item.id);
      if (item.type === "text") {
        runOnJS(setIsEditing)(true);
      }
    }
  });

  const composedGestures = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    rotationGesture,
    tapGesture
  );

  // --- Resize Gesture (Bottom-Right Handle) ---
  const bottomRightResizeGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setFocusedItem)(item.id);
      savedWidth.value = currentWidth.value;
      savedHeight.value = currentHeight.value;
      savedOriginalX.value = translateX.value;
      savedOriginalY.value = translateY.value;
    })
    .onUpdate((event) => {
      let newWidth = Math.max(MIN_WIDTH, savedWidth.value + event.translationX);
      let newHeight = Math.max(
        MIN_HEIGHT,
        savedHeight.value + event.translationY
      );

      currentWidth.value = newWidth;
      currentHeight.value = newHeight;
    })
    .onEnd(() => {
      runOnJS(saveSizeToStore)(
        translateX.value,
        translateY.value,
        currentWidth.value,
        currentHeight.value
      );
    });

  // Animated style untuk item utama
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }, // Scale dari pinch gesture
        { rotateZ: `${rotation.value}rad` },
      ],
      width: currentWidth.value,
      height: currentHeight.value,
      // Change border color if snapping
      borderColor: isFocused
        ? isSnapping
          ? "purple" // Snapping color
          : "lightblue"
        : "transparent",
      borderWidth: isFocused ? 1 : 0,
      borderStyle: "dashed",
    };
  });

  const handleCopy = () => {
    copyEditor(item.id);
    setFocusedItem(null);
  };

  const handleDelete = () => {
    deleteEditor(item.id);
    setFocusedItem(null);
  };

  const handleTextChange = (newText: string) => {
    if (item.type === "text") {
      updateTextContent(item.id, newText);
    }
  };

  const handleBlurTextInput = () => {
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const fontMgr = useFonts({
    Barrio: [require("../../assets/fonts/Barrio-Regular.ttf")],
    EduSAHand: [require("../../assets/fonts/EduSAHand-Medium.ttf")],
    Inter: [require("../../assets/fonts/Inter_18pt-Medium.ttf")],
    Montserrat: [require("../../assets/fonts/Montserrat-Medium.ttf")],
    RobotoCondensed: [
      require("../../assets/fonts/Roboto_Condensed-Regular.ttf"),
    ],
    RobotoSlab: [require("../../assets/fonts/RobotoSlab-Medium.ttf")],
    SpaceMono: [require("../../assets/fonts/SpaceMono-Regular.ttf")],
    BethanyAvanue: [require("../../assets/fonts/BethanyAvanue.otf")],
    BlMindfuck: [require("../../assets/fonts/BlMindfuck-Regular.ttf")],
    Braniella: [require("../../assets/fonts/Braniella.ttf")],
    ChillingNightime: [require("../../assets/fonts/ChillingNightime.ttf")],
    CyberBrush: [require("../../assets/fonts/CyberBrush.ttf")],
    Glinka: [require("../../assets/fonts/Glinka.ttf")],
    Inktopia: [require("../../assets/fonts/Inktopia.otf")],
    KingRimba: [require("../../assets/fonts/KingRimba.ttf")],
    MorallySerif: [require("../../assets/fonts/MorallySerif.otf")],
    OBITRUKTrial: [require("../../assets/fonts/OBITRUKTrial.ttf")],
    SimpleDiary: [require("../../assets/fonts/SimpleDiary.otf")],
    SuperAdorable: [require("../../assets/fonts/SuperAdorable.ttf")],
    Tamira: [require("../../assets/fonts/Tamira.ttf")],
    TheGoodfather: [require("../../assets/fonts/TheGoodfather.otf")],
  });
  const createParagraph = (text: string, width: number) => {
    if (!fontMgr) {
      return null;
    }
    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    const fontFamily = (item.styles?.font?.[0] as string) || "sans-serif";
    const textStyle: SkTextStyle = {
      color: (item.styles?.frontColor?.color as SkColor) || Skia.Color("#000"),
      fontFamilies: [fontFamily],
      fontSize: item.styles?.fontSize || 14,
      backgroundColor:
        (item.styles?.bgColor?.color as SkColor) || Skia.Color("#fff"),
      shadows: [
        {
          color:
            (item.styles?.shadowColor?.color as SkColor) || Skia.Color("pink"),
          offset: {
            x: item.styles?.shadowColor?.x || 0,
            y: item.styles?.shadowColor?.y || 0,
          },
        },
      ],
    };

    const builder = Skia.ParagraphBuilder.Make(paragraphStyle, fontMgr)
      .pushStyle(textStyle)
      .addText(text);

    const p = builder.build();
    p.layout(width - 20);

    return p;
  };

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View style={[styles.dragArea, animatedStyle]}>
        <View style={styles.contentContainer}>
          {item.type === "text" ? (
            isFocused && isEditing ? (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    fontFamily: item.styles?.font?.[0] || "sans-serif",
                    color: item.styles?.frontColor?.colorRaw || "black",
                    fontSize: item.styles?.fontSize,
                  },
                ]}
                value={item.text}
                onChangeText={handleTextChange}
                onBlur={handleBlurTextInput}
                multiline
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setFocusedItem(item.id);
                  setIsEditing(true);
                }}
              >
                {(() => {
                  const p = createParagraph(item.text ?? "Hello", item.width);
                  const heightCanvas = p?.getHeight();
                  return (
                    <Canvas
                      style={{
                        width: item.width,
                        height: heightCanvas,
                      }}
                    >
                      <ParagrafSkia
                        x={0}
                        y={0}
                        width={item.width}
                        paragraph={p}
                      ></ParagrafSkia>
                    </Canvas>
                  );
                })()}
              </TouchableOpacity>
            )
          ) : (
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
                opacity: item.imageStyles?.opacity,
                borderRadius: item.imageStyles?.borderRadius,
              }}
            />
          )}
        </View>

        {isFocused && (
          <>
            {/* Move Button */}
            <TouchableOpacity style={styles.moveButton}>
              <Feather name="move" size={24} color="black" />
            </TouchableOpacity>
            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <FontAwesome5 name="times-circle" size={24} color="red" />
            </TouchableOpacity>
            {/* Copy Button */}
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <FontAwesome5 name="copy" size={24} color="black" />
            </TouchableOpacity>
            <GestureDetector gesture={bottomRightResizeGesture}>
              <Animated.View style={styles.resizeHandleBottomRight} />
            </GestureDetector>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableEditorV2;
