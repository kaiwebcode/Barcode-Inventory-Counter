
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Product } from "@/types/product";
import { inventoryTheme as theme } from "@/constants/inventory-theme";

type Props = {
  product: Product;
};

export function ProductSummary({ product }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.iconBox}>
          <Ionicons
            name="cube-outline"
            size={24}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.headingText}>
          <Text style={styles.eyebrow}>SELECTED PRODUCT</Text>
          <Text style={styles.name}>{product.name}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Barcode</Text>
          <Text style={styles.value}>{product.barcode}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Expected quantity</Text>
          <Text style={styles.value}>
            {product.expectedQuantity} units
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 18,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySoft,
  },
  headingText: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: theme.colors.muted,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 14,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 13,
  },
  value: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
  },
});