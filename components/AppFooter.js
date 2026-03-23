import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '../styles/theme';

const footerItems = [
  {
    label: 'Menu',
    route: '/cardapio',
    icon: 'restaurant-outline',
    activeIcon: 'restaurant',
  },
  {
    label: 'Carrinho',
    route: '/pagamento',
    icon: 'cart-outline',
    activeIcon: 'cart',
  },
  {
    label: 'Pedidos',
    route: '/pedido-final',
    icon: 'receipt-outline',
    activeIcon: 'receipt',
  },
  {
    label: 'Conta',
    route: '/conta',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

export function AppFooter({ currentRoute }) {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      {footerItems.map((item) => {
        const isActive = currentRoute === item.route;
        const iconName = isActive ? item.activeIcon : item.icon;

        return (
          <TouchableOpacity
            key={item.route}
            activeOpacity={0.85}
            onPress={() => router.push(item.route)}
            style={styles.item}>
            <Ionicons
              name={iconName}
              size={22}
              color={isActive ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  item: {
    alignItems: 'center',
    gap: 6,
    minWidth: 72,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  labelActive: {
    color: theme.colors.primary,
  },
});
