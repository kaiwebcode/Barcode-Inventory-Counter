
import { StyleSheet, Text, View } from "react-native";
import { inventoryTheme as theme } from "@/constants/inventory-theme";

type Props = {
  expected: number;
  actual: number;
};

export function DifferenceCard({ expected, actual }: Props) {
  const difference = actual - expected;

  const matched = difference === 0;
  const positive = difference > 0;

  const status = matched
    ? "Stock matches"
    : positive
      ? "Stock surplus"
      : "Stock shortage";

  const color = matched
    ? theme.colors.success
    : positive
      ? theme.colors.primary
      : theme.colors.danger;

  const background = matched
    ? theme.colors.successSoft
    : positive
      ? theme.colors.primarySoft
      : theme.colors.dangerSoft;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Stock difference</Text>
        <View style={[styles.badge, { backgroundColor: background }]}>
          <Text style={[styles.badgeText, { color }]}>{status}</Text>
        </View>
      </View>

      <Text style={[styles.value, { color }]}>
        {difference > 0 ? "+" : ""}
        {difference}
      </Text>

      <View style={styles.breakdown}>
        <View>
          <Text style={styles.detailLabel}>Expected</Text>
          <Text style={styles.detailValue}>{expected}</Text>
        </View>

        <View>
          <Text style={styles.detailLabel}>Counted</Text>
          <Text style={styles.detailValue}>{actual}</Text>
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
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  value: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1,
  },
  breakdown: {
    flexDirection: "row",
    gap: 32,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 14,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  detailValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
});