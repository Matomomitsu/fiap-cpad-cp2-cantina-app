import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';

const previewItems = [
  { title: 'Cafe FIAP', detail: 'R$ 7,00' },
  { title: 'Sanduiche natural', detail: 'R$ 14,00' },
  { title: 'Combo rapido', detail: 'R$ 19,90' },
];

export default function CardapioScreen() {
  const router = useRouter();

  return (
    <ScreenContainer showFooter currentRoute="/cardapio">
      <View style={styles.list}>
        {previewItems.map((item) => (
          <View key={item.title} style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDetail}>{item.detail}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Finalizar pedido" onPress={() => router.push('/pagamento')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
  itemCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.md,
  },
  itemTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  itemDetail: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
