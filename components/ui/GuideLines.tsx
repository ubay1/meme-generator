import { useEditorStore } from "@/stores/editor";
import { View } from "react-native";
import { PropsCanvas } from "./DraggableEditorV2";

const GuideLines = ({ wCanvas, hCanvas }: PropsCanvas) => {
  const showVertical = useEditorStore((state) => state.showVerticalGuide);
  const showHorizontal = useEditorStore((state) => state.showHorizontalGuide);

  return (
    <View
      style={{
        height: hCanvas,
        width: wCanvas,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100, // lebih tinggi dari image
        pointerEvents: "none", // agar nggak halangi gesture
      }}
    >
      {showVertical && (
        <View
          style={{
            position: "absolute",
            left: (wCanvas as number) / 2,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: "red",
            zIndex: 999,
          }}
        />
      )}
      {showHorizontal && (
        <View
          style={{
            position: "absolute",
            top: (hCanvas as number) / 2,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: "red",
            zIndex: 1000,
          }}
        />
      )}
    </View>
  );
};

export default GuideLines;
