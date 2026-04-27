import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useCart } from '../../contexts/CartContext';
import { useOrder } from '../../contexts/OrderContext';
import { theme } from '../../styles/theme';
import { formatPrice } from '../../utils/formatPrice';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  buildCartFromOrder,
  formatOrderDateTime,
} from '../../utils/order';

export default function DetalhePedidoScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { setCart } = useCart();
  const { orderHistory } = useOrder();
  const [showItems, setShowItems] = useState(true);

  const normalizedOrderId = Array.isArray(orderId) ? orderId[0] : orderId;
  const order = orderHistory.find(
    (historyOrder) => historyOrder.id === normalizedOrderId
  );

  function handleComprarNovamente() {
    if (!order) {
      return;
    }

    setCart(buildCartFromOrder(order));
    router.push('/tabs/pagamento');
  }

  function handleCopyOrderId() {
    if (!order) {
      return;
    }

    Clipboard.setStringAsync(order.id);
  }

  if (!order) {
    return (
      <ScreenContainer showFooter currentRoute="/tabs/conta">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textMuted} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Pedido não encontrado</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer showFooter currentRoute="/tabs/conta">
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={20} color={theme.colors.textMuted} />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Detalhe do pedido</Text>
          <Text style={styles.subtitle}>
            {formatOrderDateTime(order.finalizedAt || order.createdAt)}
          </Text>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pedido nº</Text>

            <View style={styles.orderIdWrap}>
              <Text
                style={styles.orderIdText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {order.id}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCopyOrderId}
                style={styles.copyButton}>
                <Ionicons name="copy-outline" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Status</Text>
            <Text style={styles.summaryValue}>
              {ORDER_STATUS_LABELS[order.status] || order.status}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pagamento</Text>
            <Text style={styles.summaryValue}>
              {PAYMENT_METHOD_LABELS[order.formaPagamento] || order.formaPagamento}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
          </View>
        </View>

        <View style={[styles.itemsSection, !showItems && styles.itemsSectionCollapsed]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowItems((currentValue) => !currentValue)}
            style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>Itens do pedido</Text>
            <Ionicons
              name={showItems ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>

          {showItems ? (
            <ScrollView
              style={styles.itemsList}
              contentContainerStyle={styles.itemsListContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator>
              {order.itens.map(({ item, quantity }, index) => (
                <View key={`${order.id}-${item.title}`} style={styles.itemWrapper}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemName}>
                      {quantity}x {item.title}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {formatPrice(item.price * quantity)}
                    </Text>
                  </View>

                  {index < order.itens.length - 1 ? <View style={styles.divider} /> : null}
                </View>
              ))}
            </ScrollView>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Comprar novamente" onPress={handleComprarNovamente} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  backText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  content: {
    flex: 1,
    gap: theme.spacing.lg,
  },
  headerSection: {
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  summarySection: {
    gap: theme.spacing.md,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  orderIdWrap: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: theme.spacing.md,
  },
  orderPrefixText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  orderIdText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  totalValue: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  itemsSection: {
    flex: 1,
  },
  itemsSectionCollapsed: {
    flex: 0,
  },
  itemsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    paddingBottom: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.xs,
  },
  itemsTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  itemWrapper: {
    gap: 6,
  },
  itemRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    color: theme.colors.textMuted,
    flex: 1,
    fontSize: 14,
  },
  itemPrice: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: 6,
    opacity: 0.5,
  },
  actions: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
