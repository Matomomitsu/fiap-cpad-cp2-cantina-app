import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../styles/theme";

export function SegmentedButtons({ options = [], onChange }) {
  const [selected, setSelected] = useState(options[0]);

  function handleSelect(option) {
    setSelected(option);
    onChange?.(option);
  }

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option;

        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.8}
            onPress={() => handleSelect(option)}
            style={[
              styles.button,
              isSelected ? styles.selectedButton : styles.unselectedButton,
            ]}
          >
            <Text
              style={[
                styles.label,
                isSelected ? styles.selectedLabel : styles.unselectedLabel,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },

  button: {
    flex: 1,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  selectedButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  unselectedButton: {
    backgroundColor: "transparent",
    borderColor: "#3A3A3A",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },

  selectedLabel: {
    color: "#FFF",
  },

  unselectedLabel: {
    color: "#AAA",
  },
});
