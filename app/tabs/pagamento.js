import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { useCart } from '../../contexts/CartContext';
import { useOrder } from '../../contexts/OrderContext';
import { useUser } from '../../contexts/UserContext';
import {
  cancelAllPendingNotifications,
  ensureAndroidChannel,
  ensureNotificationPermissions,
  schedulePreparingNotification,
} from '../../services/notificationService';
import { theme } from '../../styles/theme';
import { formatPrice } from '../../utils/formatPrice';
import {
  ORDER_PREPARING_NOTIFICATION_OFFSET_MS,
  ORDER_PREP_DURATION_MS,
} from '../../utils/order';

const FORMAS_PAGAMENTO = [
  {
    id: 'pix',
    titulo: 'PIX',
    subtitulo: 'Aprovação instantânea',
    icone: 'qr-code-outline',
    iconBg: '#0F3D2E',
    iconColor: '#3DDC97',
  },
  {
    id: 'cartao',
    titulo: 'Cartão de Crédito',
    subtitulo: 'Final 4492 • Mastercard',
    icone: 'card-outline',
    iconBg: '#3A3A3A',
    iconColor: '#F4F4F8',
  },
  {
    id: 'saldo',
    titulo: 'Saldo na Carteira',
    subtitulo: 'Saldo disponível: R$ 45,00',
    icone: 'wallet-outline',
    iconBg: '#3D1320',
    iconColor: '#ED145B',
  },
];

export default function PagamentoScreen() {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const { startOrder } = useOrder();
  const { user } = useUser();
  const [formaSelecionada, setFormaSelecionada] = useState(null);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(false);
  const itensCarrinho = Object.values(cart);
  const carrinhoVazio = itensCarrinho.length === 0;

  const total = itensCarrinho.reduce(
    (acc, { item, quantity }) => acc + item.price * quantity,
    0
  );

  const iniciais = (user?.nome ?? 'A')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  async function handleConfirmar() {
    if (processando) {
      return;
    }

    if (!formaSelecionada) {
      setErro('Selecione uma forma de pagamento para continuar.');
      return;
    }
    setErro('');
    setProcessando(true);

    const novoPedido = startOrder({
      itens: itensCarrinho,
      total,
      formaPagamento: formaSelecionada,
    });

    // Agenda notificações locais para acompanhar o preparo. Permissão e canal
    // são configurados aqui para não pesar na abertura do app.
    try {
      await ensureAndroidChannel();
      const granted = await ensureNotificationPermissions();
      if (granted) {
        await cancelAllPendingNotifications();
        // Ancora as duas notificações no mesmo t0 (createdAt do pedido) para
        // evitar drift entre elas se o Android atrasar o agendamento.
        const t0 = new Date(novoPedido.createdAt).getTime();
        await schedulePreparingNotification(
          novoPedido.senha,
          new Date(t0 + ORDER_PREPARING_NOTIFICATION_OFFSET_MS)
        );
      }
    } catch (e) {
      console.warn('Falha ao agendar notificações:', e);
    }

    setTimeout(() => {
      router.replace('/tabs/pedido-final');
      setCart({});
      setProcessando(false);
    }, 1500);
  }

  return (
    <ScreenContainer showFooter currentRoute="/tabs/pagamento">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
          <Text style={styles.headerTitle}>Pagamento</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <Text style={styles.headerTotal}>{formatPrice(total)}</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>

        {/* Resumo */}
        <View style={styles.section}>
          <View style={styles.resumoHeader}>
            <Text style={styles.resumoTitle}>Resumo</Text>
            <Text style={styles.resumoTag}>CONFIRME SEU PEDIDO</Text>
          </View>

          {carrinhoVazio ? (
            <View style={styles.emptyCard}>
              <Ionicons name="cart-outline" size={32} color={theme.colors.textMuted} />
              <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
              <Text style={styles.emptyText}>
                Volte ao cardápio para adicionar itens ao seu pedido.
              </Text>
            </View>
          ) : (
            <View style={styles.resumoCard}>
              {itensCarrinho.map(({ item, quantity }, index) => (
                <View key={item.title}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemNome}>
                      {quantity}x {item.title}
                    </Text>
                    <Text style={styles.itemPreco}>
                      {formatPrice(item.price * quantity)}
                    </Text>
                  </View>
                  {index < itensCarrinho.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}

              <View style={styles.dividerStrong} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total a pagar</Text>
                <Text style={styles.totalValor}>{formatPrice(total)}</Text>
              </View>
            </View>
          )}
        </View>

        {!carrinhoVazio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Forma de Pagamento</Text>

            <View style={styles.metodosWrap}>
              {FORMAS_PAGAMENTO.map((forma) => {
                const selecionado = formaSelecionada === forma.id;
                return (
                  <TouchableOpacity
                    key={forma.id}
                    style={[styles.metodoCard, selecionado && styles.metodoCardSelecionado]}
                    onPress={() => {
                      setFormaSelecionada(forma.id);
                      setErro('');
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.metodoIcone, { backgroundColor: forma.iconBg }]}>
                      <Ionicons name={forma.icone} size={22} color={forma.iconColor} />
                    </View>

                    <View style={styles.metodoInfo}>
                      <Text style={styles.metodoTitulo}>{forma.titulo}</Text>
                      <Text style={styles.metodoSubtitulo}>{forma.subtitulo}</Text>
                    </View>

                    <View style={[styles.radio, selecionado && styles.radioSelecionado]}>
                      {selecionado && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            <View style={styles.secureRow}>
              <Ionicons name="lock-closed" size={12} color={theme.colors.textMuted} />
              <Text style={styles.secureText}>AMBIENTE SEGURO E CRIPTOGRAFADO</Text>
            </View>
          </View>
        )}

      </ScrollView>

      {!carrinhoVazio && (
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={processando}
          onPress={handleConfirmar}
          style={[styles.cta, processando && { opacity: 0.7 }]}
        >
          <LinearGradient
            colors={[theme.colors.primaryAlt, theme.colors.primary, '#C90F4E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaFill}
          >
            {processando ? (
              <>
                <ActivityIndicator color={theme.colors.text} />
                <Text style={styles.ctaText}>Processando...</Text>
              </>
            ) : (
              <>
                <Text style={styles.ctaText}>Confirmar Pagamento</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTotal: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },

  body: { flex: 1 },
  bodyContent: {
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  section: { gap: theme.spacing.sm },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },

  // Resumo
  resumoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  resumoTitle: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  resumoTag: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  resumoCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  itemNome: {
    color: theme.colors.text,
    fontSize: 15,
    flex: 1,
    fontWeight: '500',
  },
  itemPreco: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
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
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  totalLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  totalValor: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },

  // Métodos
  metodosWrap: {
    gap: theme.spacing.sm,
  },
  metodoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    padding: theme.spacing.md,
  },
  metodoCardSelecionado: {
    borderColor: theme.colors.primary,
  },
  metodoIcone: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metodoInfo: { flex: 1 },
  metodoTitulo: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  metodoSubtitulo: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelecionado: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },

  erro: {
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 4,
  },

  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
  },
  secureText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
  },

  // CTA
  cta: {
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  ctaFill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: theme.spacing.lg,
  },
  ctaText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  // Empty
  emptyCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: 8,
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
