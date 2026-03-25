import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import { theme } from '../styles/theme';

export default function ContaScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const {cart, setCart} = useCart();
  const {order, setOrder} = useOrder();

  function handleSair() {
    setUser(null);
    setCart({});
    setOrder(null);
    router.replace('/login');
  }

  return (
    <ScreenContainer showFooter currentRoute="/conta">
      <View style={styles.accountCard}>
        <Text style={styles.accountTitle}>Minha Conta</Text>
        <Text style={styles.accountText}>Nome: {user?.nome ?? '—'}</Text>
        <Text style={styles.accountText}>RM: {user?.rm ?? '—'}</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Sair" onPress={handleSair} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
});
