import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, PressableProps } from "react-native";

interface ThemedButtonIconProps extends PressableProps {
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  label?: string;
  size?: number;
  disabled?: boolean;
}

export function ThemedButtonIcon({
  iconName,
  label,
  size = 18,
  disabled,
  ...pressableProps
}: ThemedButtonIconProps) {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: Colors[colorScheme || "light"].background,
          borderColor: Colors[colorScheme || "light"].border,
          borderWidth: 1,
          opacity: pressed || disabled ? 0.5 : 1,
          padding: 8,
          display: "flex",
          flexDirection: "row",
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        },
      ]}
      {...pressableProps}
    >
      {iconName && (
        <MaterialCommunityIcons
          name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
          size={size}
          color={Colors[colorScheme || "light"].text2}
        />
      )}
      {label && <ThemedText type="default">{label}</ThemedText>}
    </Pressable>
  );
}
