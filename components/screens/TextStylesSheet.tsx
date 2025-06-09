/* eslint-disable react-hooks/exhaustive-deps */
import { Colors } from "@/constants/Colors";
import { FontName } from "@/hooks/useFont";
import { useEditorStore } from "@/stores/editor";
import Slider from "@react-native-community/slider";
import { Skia } from "@shopify/react-native-skia";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import ColorPicker, {
  ColorFormatsObject,
  OpacitySlider,
  Panel4,
  PreviewText,
} from "reanimated-color-picker";
import { colorPickerStyle } from "../styles/colorpicker";
import { styleBottomSheet } from "../styles/meme-generate";
import BaseModalColorPicker from "../ui/BaseModalColorPicker";
import { ThemedText } from "../ui/ThemedText";

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
    { label: "Bethany Avenue", fontName: "BethanyAvanue" },
    { label: "BL Mindfuck", fontName: "BlMindfuck" },
    { label: "Braniella", fontName: "Braniella" },
    { label: "Chilling Nightime", fontName: "ChillingNightime" },
    { label: "Cyber Brush", fontName: "CyberBrush" },
    { label: "Glinka", fontName: "Glinka" },
    { label: "Inktopia", fontName: "Inktopia" },
    { label: "King Rimba", fontName: "KingRimba" },
    { label: "Morally Serif", fontName: "MorallySerif" },
    { label: "OBIT RUK Trial", fontName: "OBITRUKTrial" },
    { label: "Simple Diary", fontName: "SimpleDiary" },
    { label: "Super Adorable", fontName: "SuperAdorable" },
    { label: "Tamira", fontName: "Tamira" },
    { label: "The Goodfather", fontName: "TheGoodfather" },
  ];

  // Helper function to update font styles in the store
  const handleUpdateFont = (fontName: FontName) => {
    updateTextStyle(items.id, {
      ...items.styles,
      font: [fontName], // Assuming font is an array of strings
      frontColor: {
        color: items.styles?.frontColor?.color || Skia.Color("black"), // Keep existing color or default
        colorRaw: items.styles?.frontColor?.colorRaw as string,
      },
      fontSize: localFontSize, // Use the current local font size
    });
  };

  // initial random color
  const [resultColor, setResultColor] = useState(
    items.styles?.frontColor?.colorRaw || "black"
  );
  const [resultBgColor, setResultBgColor] = useState(
    items.styles?.bgColor?.colorRaw || "white"
  );
  const [resultShadowColor, setResultShadowColor] = useState(
    items.styles?.shadowColor?.colorRaw || "white"
  );
  const [posisiXShadow, setPosisiXShadow] = useState(
    items.styles?.shadowColor?.x || 0
  );
  const [posisiYShadow, setPosisiYShadow] = useState(
    items.styles?.shadowColor?.y || 0
  );
  useEffect(() => {
    setPosisiXShadow(items.styles?.shadowColor?.x || 0);
    setPosisiYShadow(items.styles?.shadowColor?.y || 0);
  }, [items.styles?.shadowColor?.x, items.styles?.shadowColor?.y]);

  const currentColor = useSharedValue(resultColor);
  const currentBgColor = useSharedValue(resultBgColor);
  const currentShadowColor = useSharedValue(resultShadowColor);

  const onColorChange = (color: ColorFormatsObject) => {
    "worklet";
    currentColor.value = color.hex;
  };
  const onBgColorChange = (color: ColorFormatsObject) => {
    "worklet";
    currentBgColor.value = color.hex;
  };
  const onShadowColorChange = (color: ColorFormatsObject) => {
    "worklet";
    currentShadowColor.value = color.hex;
  };

  const onColorPick = (color: ColorFormatsObject) => {
    setResultColor(color.hex);
    updateTextStyle(items.id, {
      ...items.styles,
      frontColor: {
        color: Skia.Color(color.hex),
        colorRaw: color.hex,
      },
      fontSize: localFontSize, // Use the current local font size
    });
  };
  const onBgColorPick = (color: ColorFormatsObject) => {
    setResultBgColor(color.hex);
    updateTextStyle(items.id, {
      ...items.styles,
      bgColor: {
        color: Skia.Color(color.hex),
        colorRaw: color.hex,
      },
      fontSize: localFontSize, // Use the current local font size
    });
  };
  const onShadowColorPick = (color: ColorFormatsObject) => {
    setResultShadowColor(color.hex);
    updateTextStyle(items.id, {
      ...items.styles,
      shadowColor: {
        color: Skia.Color(color.hex),
        colorRaw: color.hex,
        x: items.styles?.shadowColor?.x || 0,
        y: items.styles?.shadowColor?.y || 0,
      },
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
        <View style={{ flexDirection: "row", gap: 4 }}>
          <ThemedText type="defaultSemiBold">Warna teks</ThemedText>
          <View
            style={{
              backgroundColor: currentColor.value,
              padding: 2,
              height: 20,
              width: 20,
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "#fff" : "#000",
            }}
          ></View>
        </View>
        <BaseModalColorPicker
          name="Color Picker"
          backgroundColor={currentColor}
        >
          <KeyboardAvoidingView behavior="position">
            <View style={colorPickerStyle.pickerContainer}>
              <ColorPicker
                value={resultColor}
                sliderThickness={25}
                thumbSize={30}
                thumbShape="rect"
                onChange={onColorChange}
                onCompleteJS={onColorPick}
                style={colorPickerStyle.picker}
              >
                <Panel4 style={colorPickerStyle.panelStyle} thumbShape="ring" />
                <OpacitySlider style={colorPickerStyle.sliderStyle} />
                <View style={{ height: 1, backgroundColor: "#bebdbe" }} />
                <PreviewText
                  style={colorPickerStyle.previewTxt}
                  colorFormat="hex"
                />
              </ColorPicker>
            </View>
          </KeyboardAvoidingView>
        </BaseModalColorPicker>
      </View>

      <View
        style={[
          styleBottomSheet.container,
          { borderBottomColor: Colors[colorScheme || "light"].border },
        ]}
      >
        <View style={{ flexDirection: "row", gap: 4 }}>
          <ThemedText type="defaultSemiBold">Warna Background teks</ThemedText>
          <View
            style={{
              backgroundColor: currentBgColor.value,
              padding: 2,
              height: 20,
              width: 20,
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "#fff" : "#000",
            }}
          ></View>
        </View>
        <BaseModalColorPicker
          name="Background Color Picker"
          backgroundColor={currentBgColor}
        >
          <KeyboardAvoidingView behavior="position">
            <View style={colorPickerStyle.pickerContainer}>
              <ColorPicker
                value={resultBgColor}
                sliderThickness={25}
                thumbSize={30}
                thumbShape="rect"
                onChange={onBgColorChange}
                onCompleteJS={onBgColorPick}
                style={colorPickerStyle.picker}
              >
                <Panel4 style={colorPickerStyle.panelStyle} thumbShape="ring" />
                <OpacitySlider style={colorPickerStyle.sliderStyle} />
                <View style={{ height: 1, backgroundColor: "#bebdbe" }} />
                <PreviewText
                  style={colorPickerStyle.previewTxt}
                  colorFormat="hex"
                />
              </ColorPicker>
            </View>
          </KeyboardAvoidingView>
        </BaseModalColorPicker>
      </View>

      <View
        style={[
          styleBottomSheet.container,
          {
            borderBottomColor: Colors[colorScheme || "light"].border,
            flexDirection: "column",
          },
        ]}
      >
        <View style={{ flexDirection: "row", gap: 4 }}>
          <ThemedText type="defaultSemiBold">Warna Shadow teks</ThemedText>
          <View
            style={{
              backgroundColor: currentShadowColor.value,
              padding: 2,
              height: 20,
              width: 20,
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "#fff" : "#000",
            }}
          ></View>
        </View>
        <BaseModalColorPicker
          name="Color Picker"
          backgroundColor={currentShadowColor}
        >
          <KeyboardAvoidingView behavior="position">
            <View style={colorPickerStyle.pickerContainer}>
              <ColorPicker
                value={resultShadowColor}
                sliderThickness={25}
                thumbSize={30}
                thumbShape="rect"
                onChange={onShadowColorChange}
                onCompleteJS={onShadowColorPick}
                style={colorPickerStyle.picker}
              >
                <Panel4 style={colorPickerStyle.panelStyle} thumbShape="ring" />
                <OpacitySlider style={colorPickerStyle.sliderStyle} />
                <View style={{ height: 1, backgroundColor: "#bebdbe" }} />
                <PreviewText
                  style={colorPickerStyle.previewTxt}
                  colorFormat="hex"
                />
              </ColorPicker>
            </View>
          </KeyboardAvoidingView>
        </BaseModalColorPicker>

        <View style={{ flexDirection: "column", gap: 4 }}>
          <ThemedText type="defaultSemiBold">Posisi X</ThemedText>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            value={items.styles?.shadowColor?.x || 0}
            maximumValue={10}
            minimumTrackTintColor="#cdcdcd"
            maximumTrackTintColor="#bbb"
            step={1}
            onValueChange={useCallback(
              debounce((value) => {
                setPosisiXShadow(value);
              }, 100),
              []
            )}
            onSlidingComplete={(value) => {
              updateTextStyle(items.id, {
                ...items.styles,
                shadowColor: {
                  color: items.styles?.shadowColor?.color || Skia.Color("#000"),
                  colorRaw: items.styles?.shadowColor?.colorRaw as string,
                  x: value,
                  y: items.styles?.shadowColor?.y || 0,
                },
              });
            }}
          />
          <ThemedText type="defaultSemiBold">
            {Math.round(posisiXShadow || 0)}
          </ThemedText>
        </View>

        <View style={{ flexDirection: "column", gap: 4 }}>
          <ThemedText type="defaultSemiBold">Posisi Y</ThemedText>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            value={items.styles?.shadowColor?.y || 0}
            maximumValue={10}
            minimumTrackTintColor="#cdcdcd"
            maximumTrackTintColor="#bbb"
            step={1}
            onValueChange={useCallback(
              debounce((value) => {
                setPosisiYShadow(value);
              }, 100),
              []
            )}
            onSlidingComplete={(value) => {
              updateTextStyle(items.id, {
                ...items.styles,
                shadowColor: {
                  color: items.styles?.shadowColor?.color || Skia.Color("#000"),
                  colorRaw: items.styles?.shadowColor?.colorRaw as string,
                  x: items.styles?.shadowColor?.x || 0,
                  y: value,
                },
              });
            }}
          />
          <ThemedText type="defaultSemiBold">
            {Math.round(posisiYShadow || 0)}
          </ThemedText>
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
          onValueChange={useCallback(
            debounce((value) => {
              setLocalFontSize(value);
            }, 100),
            []
          )}
          onSlidingComplete={(value) => {
            updateTextStyle(items.id, {
              ...items.styles,
              fontSize: value,
              frontColor: {
                color: items.styles?.frontColor?.color || Skia.Color("black"),
                colorRaw: items.styles?.frontColor?.colorRaw || "black", // Maintain colorRaw if needed
              },
              font: items.styles?.font || ["SpaceMono"],
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

export default TextStylesSheet;
