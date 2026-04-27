import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { useOrder } from '../../contexts/OrderContext';
import { theme } from '../../styles/theme';
import { formatPrice } from '../../utils/formatPrice';
import {
    ORDER_STATUS_LABELS,
    PAYMENT_METHOD_LABELS,
    formatOrderDateTime,
} from '../../utils/order';

export default function PedidoFinalScreen() {
  const { activeOrder } = useOrder();

  const itens = activeOrder?.itens || [];
  const total = activeOrder?.total || 0;
  const formaPagamento = activeOrder?.formaPagamento || '';
  const numeroPedido = activeOrder?.senha || '---';
  const status = activeOrder?.status || '';
  const dataPedido = activeOrder?.createdAt || null;

  if (!activeOrder) {
    return (
      <ScreenContainer showFooter currentRoute="/tabs/pedido-final">
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nenhum pedido em andamento</Text>
          <Text style={styles.emptyText}>
            Quando um pedido for confirmado, ele aparecerá aqui até ser finalizado.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer showFooter currentRoute="/tabs/pedido-final">

      {/* Senha */}
      <View style={styles.ticketCard}>
        <Text style={styles.ticketLabel}>Senha de retirada</Text>
        <Text style={styles.ticketValue}>#{numeroPedido}</Text>
      </View>

      {/* Mensagem */}
      <Text style={styles.mensagem}>
        Retire seu pedido no balcão quando o número for chamado
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Data do pedido</Text>
          <Text style={styles.metaValue}>{formatOrderDateTime(dataPedido)}</Text>
        </View>

        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Status</Text>
          <Text style={styles.metaValue}>{ORDER_STATUS_LABELS[status] || status}</Text>
        </View>
      </View>

      {/* Resumo do pedido */}
      <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
          {itens.map(({ item, quantity }, index) => (
              <View key={item.title}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemNome}>
                    {quantity}x {item.title}
                  </Text>
                  <Text style={styles.itemPreco}>
                    {formatPrice(item.price * quantity)}
                  </Text>
                </View>
                {index < itens.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}

            <View style={styles.dividerStrong} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValor}>
                {formatPrice(total)}
              </Text>
            </View>

        <Text style={styles.pagamento}>
          Forma de pagamento: {PAYMENT_METHOD_LABELS[formaPagamento] || formaPagamento}
        </Text>
      </ScrollView>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // Ticket
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

  // Mensagem
  mensagem: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginVertical: theme.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  metaCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    padding: theme.spacing.md,
  },
  metaLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  // Card resumo
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  itemNome: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  itemPreco: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    opacity: 0.5,
  },
  dividerStrong: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: theme.colors.textMuted,
  },
  totalValor: {
    color: theme.colors.primary,
    fontWeight: '800',
  },

  pagamento: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyText: {
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
