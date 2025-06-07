import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./styles/bottom-sheet";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  children: ReactNode;
};

export default function BottomSheetInternal({
  isOpen,
  onClose,
  duration = 200,
  children,
}: Props) {
  const colorScheme = useColorScheme();
  const height = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(isOpen ? 0 : 1, { duration })
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backgroundColorSheetStyle = {
    backgroundColor: Colors[colorScheme || "light"].background2,
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen ? 1 : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={styles.flex} onPress={onClose} />
      </Animated.View>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[styles.sheet, sheetStyle, backgroundColorSheetStyle]}
      >
        {children}
      </Animated.View>
    </>
  );
}
