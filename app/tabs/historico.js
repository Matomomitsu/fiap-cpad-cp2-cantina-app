import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { useOrder } from '../../contexts/OrderContext';
import { theme } from '../../styles/theme';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUS_LABELS, formatOrderDateTime } from '../../utils/order';

export default function HistoricoScreen() {
  const router = useRouter();
  const { orderHistory } = useOrder();
  const sortedOrderHistory = [...orderHistory].sort((firstOrder, secondOrder) =>
    secondOrder.id.localeCompare(firstOrder.id)
  );

  return (
    <ScreenContainer showFooter currentRoute="/tabs/conta">
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={20} color={theme.colors.textMuted} />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>Histórico de pedidos</Text>
          <Text style={styles.subtitle}>Pedidos finalizados</Text>
        </View>

        {sortedOrderHistory.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhum pedido finalizado</Text>
          </View>
        ) : (
          sortedOrderHistory.map((order) => (
            <TouchableOpacity
              key={order.id}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: '/tabs/detalhe-pedido',
                  params: {
                    orderId: order.id,
                  },
                })
              }
              style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {formatOrderDateTime(order.finalizedAt || order.createdAt)}
                  </Text>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.historyFooter}>
                  <Text style={styles.historyPrice}>{formatPrice(order.total)}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.colors.textMuted}
                  />
                </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  },
  contentContainer: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
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
  historyCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  historyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyDate: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  historyPrice: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: 'rgba(237, 20, 91, 0.16)',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  historyFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
