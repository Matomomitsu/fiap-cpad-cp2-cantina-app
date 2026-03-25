import { useRouter } from "expo-router";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useState } from "react";

import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { SegmentedButtons } from "../components/FilterButton";
import { FoodCard } from "../components/InfoCard";
import { theme } from "../styles/theme";
import { HeaderCardapio } from "../components/HeaderMenu";

export const previewItems = {
  lanches: [
    {
      title: "Pizza com batata frita",
      price: 7500,
      description: "Pizza grande com batata crocante",
    },
    {
      title: "Sanduíche natural",
      price: 1400,
      description: "Pão integral com frango e salada",
    },
    {
      title: "Combo rápido",
      price: 1990,
      description: "Hambúrguer + batata + refrigerante",
    },
  ],
  bebidas: [
    {
      title: "Coca-Cola lata",
      price: 600,
      description: "350ml gelada",
    },
    {
      title: "Suco natural",
      price: 850,
      description: "Laranja ou limão",
    },
    {
      title: "Água mineral",
      price: 300,
      description: "Sem gás 500ml",
    },
  ],
  doces: [
    {
      title: "Brigadeiro",
      price: 400,
      description: "Tradicional gourmet",
    },
    {
      title: "Brownie",
      price: 750,
      description: "Com chocolate meio amargo",
    },
    {
      title: "Açaí 300ml",
      price: 1200,
      description: "Com granola e leite condensado",
    },
  ],
};

export default function CardapioScreen() {
  const router = useRouter();

  const [category, setCategory] = useState("lanches");

  const [cart, setCart] = useState({});

  function addItem(item) {
    setCart((prev) => {
      const existing = prev[item.title];

      if (existing) {
        return {
          ...prev,
          [item.title]: {
            ...existing,
            quantity: existing.quantity + 1,
          },
        };
      }

      return {
        ...prev,
        [item.title]: {
          item,
          quantity: 1,
        },
      };
    });
  }

  function removeItem(item) {
    setCart((prev) => {
      const existing = prev[item.title];

      if (!existing) return prev;

      if (existing.quantity === 1) {
        const newCart = { ...prev };
        delete newCart[item.title];
        return newCart;
      }

      return {
        ...prev,
        [item.title]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  }

  function getTotal() {
    return Object.values(cart).reduce(
      (total, { item, quantity }) => total + item.price * quantity,
      0,
    );
  }

  function formatPrice(value) {
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const hasItems = Object.keys(cart).length > 0;

  return (
    <ScreenContainer showFooter currentRoute="/cardapio">
      <HeaderCardapio total={getTotal()} />

      <SegmentedButtons
        options={["lanches", "bebidas", "doces"]}
        onChange={setCategory}
      />

      <Text style={styles.sectionTitle}>
        {category.charAt(0).toUpperCase() + category.slice(1)}s
      </Text>

      <ScrollView contentContainerStyle={styles.list}>
        {previewItems[category].map((item) => (
          <FoodCard
            key={item.title}
            item={item}
            onAdd={addItem}
            onRemove={removeItem}
            quantity={cart[item.title]?.quantity || 0}
          />
        ))}
      </ScrollView>

      {hasItems && (
        <View style={styles.actions}>
          <PrimaryButton
            title={`Finalizar pedido • ${formatPrice(getTotal())}`}
            onPress={() => router.push("/pagamento")}
          />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },

  actions: {
    marginTop: theme.spacing.md,
  },
});
