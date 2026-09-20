import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "chevron.forward": "chevron-right",
  "person.fill": "person",
  gear: "settings",
} satisfies Record<string, MaterialIconName>;

type IconSymbolName = keyof typeof MAPPING;

type Props = {
  name: IconSymbolName;
  size?: number;
  color: ColorValue;
  style?: ComponentProps<typeof MaterialIcons>["style"];
};

export function IconSymbol({ name, size = 24, color, style }: Props) {
  return (
    <MaterialIcons
      name={MAPPING[name]}
      size={size}
      color={color}
      style={style}
    />
  );
}