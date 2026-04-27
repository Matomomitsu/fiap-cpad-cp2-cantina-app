import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useCart } from '../../contexts/CartContext';
import { useOrder } from '../../contexts/OrderContext';
import { useUser } from '../../contexts/UserContext';
import { theme } from '../../styles/theme';

export default function ContaScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { setCart } = useCart();
  const { clearOrders } = useOrder();

  function handleSair() {
    setUser(null);
    setCart({});
    clearOrders();
    router.replace('/auth/login');
  }

  return (
    <ScreenContainer showFooter currentRoute="/tabs/conta">
      <View style={styles.content}>
        <View style={styles.topContent}>
          <View style={styles.accountCard}>
            <Text style={styles.accountTitle}>Minha Conta</Text>
            <Text style={styles.accountText}>Nome: {user?.nome ?? '—'}</Text>
            <Text style={styles.accountText}>RM: {user?.rm ?? '—'}</Text>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              title="Histórico de pedidos"
              onPress={() => router.push('/tabs/historico')}
            />
          </View>
        </View>

        <View style={styles.bottomActions}>
          <PrimaryButton title="Sair" onPress={handleSair} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContent: {
    gap: theme.spacing.lg,
  },
  accountCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  accountTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  accountText: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
  actions: {
    gap: theme.spacing.sm,
  },
  bottomActions: {
    gap: theme.spacing.sm,
  },
});
