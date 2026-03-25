import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../styles/theme";

export function FoodCard({ item, onAdd, onRemove, quantity }) {
  function formatPrice(value) {
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>

        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}

        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>

      <View style={styles.actions}>
        {quantity === 0 ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAdd(item)}
          >
            <Text style={styles.addText}>Adicionar</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => onRemove(item)}>
              <Text style={styles.counterButton}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{quantity}</Text>

            <TouchableOpacity onPress={() => onAdd(item)}>
              <Text style={styles.counterButton}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  info: {
    gap: 6,
  },

  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },

  description: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },

  price: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },

  actions: {
    marginTop: theme.spacing.md,
    alignItems: "flex-end",
  },

  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
  },

  addText: {
    color: "#FFF",
    fontWeight: "700",
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  counterButton: {
    fontSize: 18,
    color: theme.colors.primary,
    fontWeight: "700",
  },

  quantity: {
    color: theme.colors.text,
    fontWeight: "700",
  },
});
