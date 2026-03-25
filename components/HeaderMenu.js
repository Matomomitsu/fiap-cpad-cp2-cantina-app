import { StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";
import { useUser } from "../contexts/UserContext";

export function HeaderCardapio({ total }) {
  const { user } = useUser();

  function formatPrice(value) {
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View>
          <Text style={styles.welcome}>BEM-VINDO</Text>

          <Text style={styles.name}>Olá, {user?.nome ?? "Aluno"}!</Text>
        </View>
      </View>

      <View style={styles.wallet}>
        <Text style={styles.icon}>💳</Text>
        <Text style={styles.value}>{formatPrice(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,

    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  welcome: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
    letterSpacing: 1,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },

  wallet: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  icon: {
    fontSize: 16,
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
  },
});
