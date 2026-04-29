import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { useOrder } from '../../contexts/OrderContext';
import { useUser } from '../../contexts/UserContext';
import { sendReadyNotificationNow } from '../../services/notificationService';
import { theme } from '../../styles/theme';
import { formatPrice } from '../../utils/formatPrice';
import {
  ORDER_PREP_DURATION_MS,
  PAYMENT_METHOD_LABELS,
  formatOrderDateTime,
} from '../../utils/order';

export default function PedidoFinalScreen() {
  const router = useRouter();
  const { activeOrder } = useOrder();
  const { user } = useUser();

  const orderStartedAt = activeOrder?.createdAt
    ? new Date(activeOrder.createdAt).getTime()
    : null;

  const [stage, setStage] = useState(() =>
    orderStartedAt && Date.now() - orderStartedAt >= ORDER_PREP_DURATION_MS
      ? 'pronto'
      : 'preparando'
  );
  const [pdfLoading, setPdfLoading] = useState(false);

  const pulse = useRef(new Animated.Value(0)).current;
  const readyScale = useRef(new Animated.Value(stage === 'pronto' ? 1 : 0)).current;

  // Calcula tempo restante e agenda transição. Se o pedido já passou
  // do tempo de preparo (ex: usuário voltou pra essa tela depois), entra
  // direto em 'pronto' sem reanimar a transição.
  useEffect(() => {
    if (!orderStartedAt) return undefined;

    const elapsed = Date.now() - orderStartedAt;
    if (elapsed >= ORDER_PREP_DURATION_MS) {
      setStage('pronto');
      return undefined;
    }

    setStage('preparando');
    const remaining = ORDER_PREP_DURATION_MS - elapsed;
    const t = setTimeout(() => {
      setStage('pronto');
      // Dispara a notificação imediatamente no momento exato em que o app
      // detecta que o pedido ficou pronto — sem depender do agendador do SO,
      // que pode sofrer drift de vários segundos no Android.
      if (activeOrder?.senha) {
        sendReadyNotificationNow(activeOrder.senha, activeOrder.id).catch(() => {});
      }
    }, remaining);
    return () => clearTimeout(t);
  }, [orderStartedAt, activeOrder?.senha]);

  // Pulse enquanto preparando
  useEffect(() => {
    if (stage !== 'preparando') {
      pulse.stopAnimation();
      pulse.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [stage, pulse]);

  // Spring quando fica pronto
  useEffect(() => {
    if (stage !== 'pronto') return;
    Animated.spring(readyScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [stage, readyScale]);

  if (!activeOrder) {
    return (
      <ScreenContainer showFooter currentRoute="/tabs/pedido-final">
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color={theme.colors.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum pedido em andamento</Text>
          <Text style={styles.emptyText}>
            Quando um pedido for confirmado, ele aparecerá aqui até ser finalizado.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const itens = activeOrder.itens || [];
  const total = activeOrder.total || 0;
  const formaPagamento = activeOrder.formaPagamento || '';
  const senha = activeOrder.senha || '---';
  const dataPedido = activeOrder.createdAt || null;

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 1],
  });

  async function handleBaixarPDF() {
    try {
      setPdfLoading(true);
      const html = buildReceiptHTML({
        senha,
        dataPedido,
        itens,
        total,
        formaPagamento,
        userName: user?.nome ?? 'Aluno FIAP',
      });

      const { uri } = await Print.printToFileAsync({ html, base64: false });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          UTI: 'com.adobe.pdf',
          mimeType: 'application/pdf',
          dialogTitle: 'Comprovante do Pedido',
        });
      }
    } catch (e) {
      console.error('Falha ao gerar comprovante:', e);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <ScreenContainer showFooter currentRoute="/tabs/pedido-final">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero da senha */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[theme.colors.primaryAlt, theme.colors.primary, '#C90F4E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCircle}
          >
            <Ionicons name="checkmark" size={36} color={theme.colors.text} />
            <Text style={styles.heroSenha}>#{senha}</Text>
          </LinearGradient>
          <Text style={styles.heroTitle}>Pedido Realizado</Text>
          <Text style={styles.heroSubtitle}>
            Sua senha foi gerada com precisão acadêmica
          </Text>
        </View>

        {/* Status com 2 estágios animados */}
        <View
          style={[
            styles.statusCard,
            stage === 'pronto' && styles.statusCardPronto,
          ]}
        >
          {stage === 'preparando' ? (
            <>
              <Animated.View
                style={[
                  styles.statusIcon,
                  styles.statusIconPrep,
                  { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
                ]}
              >
                <Ionicons name="restaurant" size={28} color={theme.colors.primary} />
              </Animated.View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>STATUS DO PEDIDO</Text>
                <Text style={styles.statusTitle}>Em preparo</Text>
                <Text style={styles.statusText}>
                  Aguarde, seu pedido está sendo preparado pela cantina.
                </Text>
              </View>
            </>
          ) : (
            <>
              <Animated.View
                style={[
                  styles.statusIcon,
                  styles.statusIconReady,
                  { transform: [{ scale: readyScale }] },
                ]}
              >
                <Ionicons name="checkmark-circle" size={32} color="#3DDC97" />
              </Animated.View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>STATUS DO PEDIDO</Text>
                <Text style={[styles.statusTitle, styles.statusTitleReady]}>
                  Pronto para retirada!
                </Text>
                <Text style={styles.statusText}>
                  Dirija-se ao balcão com a sua senha.
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Detalhes do pedido */}
        <View style={styles.detalhesCard}>
          <View style={styles.detalhesHeader}>
            <Text style={styles.detalhesTitulo}>Detalhes do Pedido</Text>
            <Text style={styles.detalhesData}>{formatOrderDateTime(dataPedido)}</Text>
          </View>

          <View style={styles.itensList}>
            {itens.map(({ item, quantity }, index) => (
              <View key={item.title}>
                <View style={styles.itemRow}>
                  {item.image ? (
                    <Image source={item.image} style={styles.itemImage} />
                  ) : (
                    <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
                      <Ionicons name="fast-food-outline" size={20} color={theme.colors.textMuted} />
                    </View>
                  )}

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemNome} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemQtd}>Qtd: {quantity}</Text>
                  </View>

                  <Text style={styles.itemPreco}>
                    {formatPrice(item.price * quantity)}
                  </Text>
                </View>
                {index < itens.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <View style={styles.dividerStrong} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>TOTAL PAGO</Text>
              <Text style={styles.pagamentoLabel}>
                {PAYMENT_METHOD_LABELS[formaPagamento] || formaPagamento}
              </Text>
            </View>
            <Text style={styles.totalValor}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Ações */}
      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.replace('/tabs/cardapio')}
          style={styles.cta}
        >
          <LinearGradient
            colors={[theme.colors.primaryAlt, theme.colors.primary, '#C90F4E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaFill}
          >
            <Text style={styles.ctaText}>Voltar ao Início</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={pdfLoading}
          onPress={handleBaixarPDF}
          style={[styles.secondary, pdfLoading && { opacity: 0.6 }]}
        >
          {pdfLoading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Ionicons name="download-outline" size={18} color={theme.colors.text} />
          )}
          <Text style={styles.secondaryText}>
            {pdfLoading ? 'Gerando...' : 'Baixar Comprovante (PDF)'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

function buildReceiptHTML({ senha, dataPedido, itens, total, formaPagamento, userName }) {
  const linhasItens = itens
    .map(
      ({ item, quantity }) => `
        <tr>
          <td style="padding:10px 0;">${quantity}x ${escapeHtml(item.title)}</td>
          <td style="padding:10px 0; text-align:right;">${formatPrice(item.price * quantity)}</td>
        </tr>`
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Comprovante - Cantina FIAP</title>
  </head>
  <body style="font-family: -apple-system, Helvetica, Arial, sans-serif; color:#222; padding:32px; max-width:640px; margin:0 auto;">
    <div style="border-bottom:3px solid #ED145B; padding-bottom:16px; margin-bottom:24px;">
      <h1 style="margin:0; color:#ED145B; font-size:28px;">Cantina FIAP</h1>
      <p style="margin:4px 0 0; color:#666; font-size:13px;">Comprovante de Pedido</p>
    </div>

    <div style="display:flex; justify-content:space-between; gap:24px; margin-bottom:24px;">
      <div>
        <p style="margin:0; font-size:11px; color:#888; letter-spacing:1px;">SENHA DE RETIRADA</p>
        <p style="margin:4px 0 0; font-size:32px; font-weight:800; color:#ED145B;">#${escapeHtml(senha)}</p>
      </div>
      <div style="text-align:right;">
        <p style="margin:0; font-size:11px; color:#888; letter-spacing:1px;">DATA</p>
        <p style="margin:4px 0 0; font-size:14px; font-weight:600;">${escapeHtml(formatOrderDateTime(dataPedido))}</p>
      </div>
    </div>

    <p style="margin:0 0 24px; font-size:13px; color:#444;">
      Cliente: <strong>${escapeHtml(userName)}</strong>
    </p>

    <h2 style="font-size:14px; letter-spacing:1px; color:#888; border-bottom:1px solid #eee; padding-bottom:8px;">ITENS</h2>
    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      ${linhasItens}
    </table>

    <div style="border-top:2px solid #222; margin-top:16px; padding-top:16px; display:flex; justify-content:space-between; font-size:18px; font-weight:700;">
      <span>Total Pago</span>
      <span style="color:#ED145B;">${formatPrice(total)}</span>
    </div>

    <p style="margin-top:8px; font-size:12px; color:#888;">
      Forma de pagamento: ${escapeHtml(PAYMENT_METHOD_LABELS[formaPagamento] || formaPagamento)}
    </p>

    <p style="margin-top:48px; font-size:11px; color:#aaa; text-align:center;">
      Documento gerado automaticamente pelo app Cantina FIAP — sem valor fiscal.
    </p>
  </body>
  </html>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  // Hero
  hero: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  heroCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  heroSenha: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 2,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: theme.spacing.sm,
  },
  heroSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },

  // Status
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    padding: theme.spacing.md,
  },
  statusCardPronto: {
    borderColor: '#3DDC97',
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconPrep: {
    backgroundColor: '#3D1320',
  },
  statusIconReady: {
    backgroundColor: '#0F3D2E',
  },
  statusInfo: { flex: 1, gap: 2 },
  statusLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
  },
  statusTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  statusTitleReady: {
    color: '#3DDC97',
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },

  // Detalhes
  detalhesCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  detalhesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detalhesTitulo: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  detalhesData: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  itensList: {
    gap: 0,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
  },
  itemImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemInfo: { flex: 1 },
  itemNome: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  itemQtd: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  itemPreco: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    opacity: 0.4,
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
    paddingVertical: theme.spacing.xs,
  },
  totalLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
  },
  pagamentoLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  totalValor: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: '800',
  },

  // Ações
  actions: {
    gap: theme.spacing.sm,
  },
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: theme.spacing.lg,
  },
  ctaText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  secondaryText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
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
