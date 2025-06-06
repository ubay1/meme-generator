import { EditorItem, useEditorStore } from "@/stores/editor";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import {
  Canvas,
  Paragraph as ParagrafSkia,
  SkColor,
  Skia,
  TextAlign,
  useFonts,
} from "@shopify/react-native-skia";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  StyleSheet,
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

const MIN_HEIGHT = 50;
const MIN_WIDTH = 50; // Ubah menjadi 50 agar lebih fleksibel untuk teks juga

type Props = {
  item: EditorItem;
  isFocused: boolean;
};

const DraggableEditor = ({ item, isFocused }: Props) => {
  const deleteEditor = useEditorStore((state) => state.deleteEditor);
  const copyEditor = useEditorStore((state) => state.copyEditor);
  const updateTextContent = useEditorStore((state) => state.updateTextContent);
  const updateItemTransform = useEditorStore(
    (state) => state.updateItemTransform
  );
  const updateItemSize = useEditorStore((state) => state.updateItemSize);
  const setFocusedItem = useEditorStore((state) => state.setFocusedItem);

  // const [imageUri, setImageUri] = useState("");
  // const image = useImage(imageUri || "");

  // Inisialisasi useSharedValue dengan state dari item
  const translateX = useSharedValue(item.x);
  const translateY = useSharedValue(item.y);
  const scale = useSharedValue(item.scale);
  const rotation = useSharedValue(item.rotation);

  const currentWidth = useSharedValue(item.width);
  const currentHeight = useSharedValue(item.height);

  // Saved values untuk gesture drag, pinch, rotate
  const savedTranslateX = useSharedValue(item.x);
  const savedTranslateY = useSharedValue(item.y);
  const savedScale = useSharedValue(item.scale);
  const savedRotation = useSharedValue(item.rotation);

  // Saved values untuk gesture resize (Bottom-Right)
  const savedWidth = useSharedValue(item.width);
  const savedHeight = useSharedValue(item.height);
  const savedOriginalX = useSharedValue(item.x);
  const savedOriginalY = useSharedValue(item.y);

  const [isEditing, setIsEditing] = useState(false);

  // Sinkronisasi state dari store ke shared values Reanimated
  // Gunakan dependencies yang lebih spesifik untuk mencegah re-render yang tidak perlu.
  // Item sebagai objek akan sering berubah, jadi lebih baik pecah.
  useEffect(() => {
    translateX.value = item.x;
    translateY.value = item.y;
    scale.value = item.scale;
    rotation.value = item.rotation;
    currentWidth.value = item.width;
    currentHeight.value = item.height;
    // Juga update saved values agar selalu sinkron dengan state terbaru dari store
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
    // Tambahkan shared values itu sendiri sebagai dependencies untuk menghindari warning
    // Namun sebenarnya tidak perlu karena nilai shared values diupdate langsung di sini
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

  // Callback untuk menyimpan transformasi (posisi, skala, rotasi) ke store
  const saveTransformToStore = () => {
    // console.log(`Saving transform: x=${translateX.value.toFixed(2)}, y=${translateY.value.toFixed(2)}, scale=${scale.value.toFixed(2)}, rotation=${rotation.value.toFixed(2)}`);
    updateItemTransform(
      item.id,
      translateX.value,
      translateY.value,
      scale.value,
      rotation.value
    );
  };

  // Callback untuk menyimpan ukuran (lebar, tinggi, dan posisi baru) ke store
  const saveSizeToStore = (
    newX: number,
    newY: number,
    newWidth: number,
    newHeight: number
  ) => {
    // console.log(`Saving size: x=${newX.toFixed(2)}, y=${newY.toFixed(2)}, w=${newWidth.toFixed(2)}, h=${newHeight.toFixed(2)}`);
    updateItemSize(item.id, newWidth, newHeight, newX, newY);
  };

  // --- Gestures ---

  // Pan Gesture (untuk memindahkan item)
  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setFocusedItem)(item.id);
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
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

  // Komposisi gesture utama untuk item
  // Gesture resize harus terpisah dari composedGestures utama agar tidak konflik
  // dan ditempatkan langsung di GestureDetector masing-masing handle.
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
      // Posisi X dan Y tidak berubah untuk BR
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
      borderColor: isFocused ? "lightblue" : "transparent",
      borderWidth: isFocused ? 1 : 0,
      borderStyle: "dashed", // Style border hanya saat focused
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
  });
  const createParagraph = (text: string, width: number) => {
    if (!fontMgr) {
      return null;
    }
    // Are the font loaded already?
    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    const fontFamily = (item.styles?.font?.[0] as string) || "sans-serif";
    const textStyle = {
      color: (item.styles?.color as SkColor) || Skia.Color("#000"),
      fontFamilies: [fontFamily],
      fontSize: item.styles?.fontSize || 14,
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
                    color: item.styles?.colorRaw || "black",
                    fontSize: item.styles?.fontSize, // Pertahankan ukuran font dasar
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
                  const heightCanvas = p?.getHeight(); // hitung tinggi yang dibutuhkan
                  // console.log("heightCanvas", heightCanvas);
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
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
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

const styles = StyleSheet.create({
  dragArea: {
    position: "absolute",
    padding: 5, // Padding untuk batas sentuhan handle
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  textInput: {
    fontSize: 20,
    textAlign: "center",
    padding: 0,
    // minWidth: 100, // Sekarang diatur oleh MIN_WIDTH
    // minHeight: 30, // Sekarang diatur oleh MIN_HEIGHT
    flexShrink: 1,
    flexGrow: 1,
    width: "100%", // Pastikan TextInput mengisi 100% dari parentnya
    height: "100%", // Pastikan TextInput mengisi 100% dari parentnya
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
    flexGrow: 1,
    width: "100%", // Pastikan Text mengisi 100% dari parentnya
    height: "100%", // Pastikan Text mengisi 100% dari parentnya
    textAlignVertical: "center", // Agar teks berada di tengah secara vertikal
  },
  deleteButton: {
    position: "absolute",
    top: -40,
    right: -30,
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5, // Tambahkan padding untuk area sentuhan
  },
  moveButton: {
    position: "absolute",
    top: -40,
    left: "40%",
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5, // Tambahkan padding untuk area sentuhan
  },
  copyButton: {
    position: "absolute",
    top: -40,
    left: -30,
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5, // Tambahkan padding untuk area sentuhan
  },
  // Handle styles
  resizeHandleTopLeft: {
    position: "absolute",
    top: -10, // Geser sedikit agar lebih mudah diakses
    left: -10, // Geser sedikit
    width: 20, // Ukuran handle lebih besar
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10, // Buat bulat
    zIndex: 10,
  },
  resizeHandleTopCenter: {
    position: "absolute",
    top: -10,
    left: "50%",
    marginLeft: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
  resizeHandleTopRight: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
  resizeHandleBottomLeft: {
    position: "absolute",
    bottom: -10,
    left: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
  resizeHandleBottomCenter: {
    position: "absolute",
    bottom: -10,
    left: "50%",
    marginLeft: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
  resizeHandleBottomRight: {
    position: "absolute",
    bottom: -10,
    right: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
});

export default DraggableEditor;
