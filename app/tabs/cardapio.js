import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SegmentedButtons } from "../../components/FilterButton";
import { HeaderCardapio } from "../../components/HeaderMenu";
import { FoodCard } from "../../components/InfoCard";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useCart } from '../../contexts/CartContext';
import { theme } from "../../styles/theme";
import { formatPrice } from '../../utils/formatPrice';

export const previewItems = {
  Lanches: [
    {
      title: "Pizza com batata frita",
      price: 7500,
      description: "Pizza grande com batata crocante",
      image: require("../../assets/images/menu/pizza_batata.png"),
    },
    {
      title: "Sanduíche natural",
      price: 1400,
      description: "Pão integral com frango e salada",
      image: require("../../assets/images/menu/sanduiche_natural.png"),
    },
    {
      title: "Combo rápido",
      price: 1990,
      description: "Hambúrguer + batata + refrigerante",
      image: require("../../assets/images/menu/combo_rapido.png"),
    },
  ],
  Bebidas: [
    {
      title: "Coca-Cola lata",
      price: 600,
      description: "350ml gelada",
      image: require("../../assets/images/menu/coca_lata.png"),
    },
    {
      title: "Suco natural",
      price: 850,
      description: "Laranja ou limão",
      image: require("../../assets/images/menu/suco_natural.png"),
    },
    {
      title: "Água mineral",
      price: 300,
      description: "Sem gás 500ml",
      image: require("../../assets/images/menu/agua_mineral.png"),
    },
  ],
  Doces: [
    {
      title: "Brigadeiro",
      price: 400,
      description: "Tradicional gourmet",
      image: require("../../assets/images/menu/brigadeiro.png"),
    },
    {
      title: "Brownie",
      price: 750,
      description: "Com chocolate meio amargo",
      image: require("../../assets/images/menu/brownie.png"),
    },
    {
      title: "Açaí 300ml",
      price: 1200,
      description: "Com granola e leite condensado",
      image: require("../../assets/images/menu/acai.png"),
    },
  ],
};

export default function CardapioScreen() {
  const router = useRouter();

  const [category, setCategory] = useState("Lanches");

  const { cart, setCart } = useCart();

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

  const hasItems = Object.keys(cart).length > 0;

  return (
    <ScreenContainer showFooter currentRoute="/tabs/cardapio">
      <HeaderCardapio total={getTotal()} />

      <SegmentedButtons
        options={["Lanches", "Bebidas", "Doces"]}
        onChange={setCategory}
      />

      <Text style={styles.sectionTitle}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
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
            onPress={() => router.push("/tabs/pagamento")}
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
