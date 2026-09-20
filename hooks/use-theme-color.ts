
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemeColors = {
  light?: string;
  dark?: string;
};

type ColorName = keyof typeof Colors.light;

export function useThemeColor(
  props: ThemeColors,
  colorName: ColorName
) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}