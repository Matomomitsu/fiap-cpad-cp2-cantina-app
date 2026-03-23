import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';

export default function PedidoFinalScreen() {
  return (
    <ScreenContainer showFooter currentRoute="/pedido-final">
      <View style={styles.ticketCard}>
        <Text style={styles.ticketLabel}>Senha de retirada</Text>
        <Text style={styles.ticketValue}>A-024</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  ticketCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.xl,
  },
  ticketLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ticketValue: {
    color: theme.colors.primary,
    fontSize: 42,
    fontWeight: '800',
    marginTop: theme.spacing.sm,
  },
});
