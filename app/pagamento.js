import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';

const paymentOptions = ['Pix', 'Cartao', 'Saldo'];

export default function PagamentoScreen() {
  const router = useRouter();

  return (
    <ScreenContainer showFooter currentRoute="/pagamento">
      <View style={styles.optionsRow}>
        {paymentOptions.map((option) => (
          <View key={option} style={styles.optionChip}>
            <Text style={styles.optionLabel}>{option}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Confirmar pagamento" onPress={() => router.push('/pedido-final')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  optionChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  optionLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
