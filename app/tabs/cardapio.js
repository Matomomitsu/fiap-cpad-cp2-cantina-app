import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SegmentedButtons } from "../../components/FilterButton";
import { HeaderCardapio } from "../../components/HeaderMenu";
import { FoodCard } from "../../components/InfoCard";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useCart } from "../../contexts/CartContext";
import { theme } from "../../styles/theme";
import { formatPrice } from "../../utils/formatPrice";

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

  const flatListRef = useRef(null);

  const [category, setCategory] = useState("Lanches");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { cart, setCart } = useCart();

  function handleCategoryChange(value) {
    setCategory(value);

    flatListRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }

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
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0,
    );
  }

  const filteredItems = useMemo(() => {
    const text = search.toLowerCase();

    const filtered = previewItems[category].filter((item) => {
      return (
        item.title.toLowerCase().includes(text) ||
        item.description.toLowerCase().includes(text)
      );
    });

    switch (sortBy) {
      case "lowest":
        return [...filtered].sort((a, b) => a.price - b.price);

      case "highest":
        return [...filtered].sort((a, b) => b.price - a.price);

      default:
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
  }, [category, search, sortBy]);

  const hasItems = Object.keys(cart).length > 0;

  return (
    <ScreenContainer showFooter currentRoute="/tabs/cardapio">
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={filteredItems}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              onAdd={addItem}
              onRemove={removeItem}
              quantity={cart[item.title]?.quantity || 0}
            />
          )}
          ListHeaderComponent={
            <>
              <HeaderCardapio total={getTotal()} />

              <SegmentedButtons
                options={["Lanches", "Bebidas", "Doces"]}
                onChange={handleCategoryChange}
              />

              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Buscar produto..."
                  placeholderTextColor={theme.colors.text}
                  value={search}
                  onChangeText={setSearch}
                  style={styles.input}
                />

                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch("")}>
                    <Text style={styles.clearButton}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.sortContainer}>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    sortBy === "name" && styles.sortButtonActive,
                  ]}
                  onPress={() => setSortBy("name")}
                >
                  <Text
                    style={[
                      styles.sortText,
                      sortBy === "name" && styles.sortTextActive,
                    ]}
                  >
                    A-Z
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    sortBy === "lowest" && styles.sortButtonActive,
                  ]}
                  onPress={() => setSortBy("lowest")}
                >
                  <Text
                    style={[
                      styles.sortText,
                      sortBy === "lowest" && styles.sortTextActive,
                    ]}
                  >
                    Menor preço
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    sortBy === "highest" && styles.sortButtonActive,
                  ]}
                  onPress={() => setSortBy("highest")}
                >
                  <Text
                    style={[
                      styles.sortText,
                      sortBy === "highest" && styles.sortTextActive,
                    ]}
                  >
                    Maior preço
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>{category}</Text>

              <Text style={styles.results}>
                {filteredItems.length} produto(s) encontrado(s)
              </Text>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🍔</Text>

              <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
            </View>
          }
          ListFooterComponent={
            hasItems ? (
              <View style={styles.actions}>
                <PrimaryButton
                  title={`Finalizar pedido • ${formatPrice(getTotal())}`}
                  onPress={() => router.push("/tabs/pagamento")}
                />
              </View>
            ) : (
              <View style={{ height: 40 }} />
            )
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 40,
  },

  container: {
    flex: 1,
  },

  searchContainer: {
    marginTop: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },

  input: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.6,
  },

  clearButton: {
    fontSize: 18,
    color: theme.colors.gray,
  },

  sortContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },

  sortButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },

  sortButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  sortText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },

  sortTextActive: {
    color: "#fff",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },

  results: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
    opacity: 0.6,
    marginBottom: theme.spacing.md,
  },

  actions: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyEmoji: {
    fontSize: 48,
  },

  emptyTitle: {
    marginTop: theme.spacing.md,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
});
