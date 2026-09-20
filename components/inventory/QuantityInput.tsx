
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export function QuantityInput({
  value,
  onChange,
  error,
  disabled = false,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Actual quantity counted</Text>

      <TextInput
        value={value}
        onChangeText={(text) => {
          // Only allow digits. Empty input is allowed while editing.
          if (/^\d*$/.test(text)) {
            onChange(text);
          }
        }}
        placeholder="e.g. 45"
        keyboardType="number-pad"
        editable={!disabled}
        style={[styles.input, error ? styles.inputError : null]}
        accessibilityLabel="Actual quantity counted"
        returnKeyType="done"
      />

      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : (
        <Text style={styles.helper}>
          Enter the number of items physically counted.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 9,
  },
  label: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 18,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  error: {
    color: "#DC2626",
    fontSize: 13,
  },
  helper: {
    color: "#64748B",
    fontSize: 13,
  },
});