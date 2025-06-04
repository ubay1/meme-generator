import { ThemedText } from "@/components/ThemedText";
import { IconSymbol, type IconSymbolName } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Pressable, PressableProps } from "react-native";

interface ThemedButtonIconProps extends PressableProps {
  iconName: IconSymbolName;
  label: string;
  size?: number;
}

export function ThemedButtonIcon({
  iconName,
  label,
  size = 18,
  ...pressableProps
}: ThemedButtonIconProps) {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      style={{
        backgroundColor: Colors[colorScheme || "light"].background,
        borderColor: Colors[colorScheme || "light"].border,
        borderWidth: 1,
        padding: 8,
        display: "flex",
        flexDirection: "row",
        gap: 4,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      }}
      {...pressableProps}
    >
      <IconSymbol
        name={iconName}
        size={size}
        color={Colors[colorScheme || "light"].text2}
      />
      <ThemedText type="default">{label}</ThemedText>
    </Pressable>
  );
}
