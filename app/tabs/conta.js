import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useCart } from '../../contexts/CartContext';
import { useOrder } from '../../contexts/OrderContext';
import { useUser } from '../../contexts/UserContext';
import { theme } from '../../styles/theme';

export default function ContaScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const { setCart } = useCart();
  const { clearOrders } = useOrder();

  async function handleSair() {
    await logout();
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
            <Text style={styles.accountText}>E-mail: {user?.email ?? '—'}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/tabs/historico')}
              style={styles.historyCard}>
              <View style={styles.historyCardLeft}>
                <View style={styles.historyIconWrap}>
                  <Ionicons name="receipt-outline" size={20} color={theme.colors.primary} />
                </View>

                <Text style={styles.historyCardLabel}>Histórico de pedidos</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
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
  historyCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  historyCardLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: theme.spacing.sm,
  },
  historyIconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  historyCardLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomActions: {
    gap: theme.spacing.sm,
  },
});
