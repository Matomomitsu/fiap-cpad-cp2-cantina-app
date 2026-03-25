import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useCart } from '../contexts/CartContext';
import { theme } from '../styles/theme';
import { formatPrice } from '../utils/formatPrice';

const FORMAS_PAGAMENTO = [
  {
    id: 'pix',
    titulo: 'PIX',
    icone: 'qr-code-outline',
  },
  {
    id: 'cartao',
    titulo: 'Cartão de Crédito',
    icone: 'card-outline',
  },
  {
    id: 'saldo',
    titulo: 'Saldo na Carteira',
    icone: 'wallet-outline',
  },
];

export default function PagamentoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const itensPedido = params.itens ? JSON.parse(params.itens) : [];

  const { cart } = useCart();
  const [formaSelecionada, setFormaSelecionada] = useState(null);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(false);

  const total = Object.values(cart).reduce(
    (acc, { item, quantity }) => acc + item.price * quantity,
    0
  );

  function handleConfirmar() {
    if (!formaSelecionada) {
      setErro('Selecione uma forma de pagamento para continuar.');
      return;
    }
    setErro('');
    setProcessando(true);

    setTimeout(() => {
      const numeroPedido = Math.floor(1000 + Math.random() * 9000).toString();
      router.push({
        pathname: '/pedido-final',
        params: {
          itens: JSON.stringify(itensPedido),
          total: total.toFixed(2),
          formaPagamento: formaSelecionada,
          numeroPedido,
        },
      });
      setProcessando(false);
    }, 1500);
  }

  return (
    <ScreenContainer showFooter currentRoute="/pagamento">

      {/* Botão voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color={theme.colors.textMuted} />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      {/* Conteúdo principal */}
      <View style={styles.body}>

        {/* Resumo do pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens no Carrinho</Text>

          <View style={styles.card}>
            {Object.values(cart).map(({ item, quantity }, index) => (
              <View key={item.title}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemNome}>
                    {quantity}x {item.title}
                  </Text>
                  <Text style={styles.itemPreco}>
                    {formatPrice(item.price * quantity)}
                  </Text>
                </View>
                {index < Object.values(cart).length - 1 && (
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
          </View>
        </View>

        {/* Forma de pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>

          <View style={styles.card}>
            {FORMAS_PAGAMENTO.map((forma, index) => {
              const selecionado = formaSelecionada === forma.id;
              return (
                <View key={forma.id}>
                  <TouchableOpacity
                    style={styles.pagamentoRow}
                    onPress={() => {
                      setFormaSelecionada(forma.id);
                      setErro('');
                    }}
                    activeOpacity={0.7}
                  >
                    {/* Ícone */}
                    <View style={[styles.iconeWrap, selecionado && styles.iconeWrapSelecionado]}>
                      <Ionicons
                        name={forma.icone}
                        size={20}
                        color={selecionado ? theme.colors.primary : theme.colors.textMuted}
                      />
                    </View>

                    {/* Texto */}
                    <View style={styles.pagamentoInfo}>
                      <Text style={styles.pagamentoTitulo}>{forma.titulo}</Text>
                    </View>

                    {/* Radio */}
                    <View style={[styles.radio, selecionado && styles.radioSelecionado]}>
                      {selecionado && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>

                  {index < FORMAS_PAGAMENTO.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              );
            })}
          </View>

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
        </View>

      </View>

      {/* Botão confirmar */}
      <View style={styles.actions}>
        <PrimaryButton
          title={processando ? 'Processando...' : 'Confirmar Pagamento'}
          onPress={handleConfirmar}
          disabled={processando}
        />
      </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // Botão voltar
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  backText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },

  body: {
    flex: 1,
    gap: theme.spacing.lg,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  // Card
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
  },

  // Itens do resumo
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  itemNome: {
    color: theme.colors.textMuted,
    fontSize: 14,
    flex: 1,
  },
  itemPreco: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  // Dividers
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

  // Total
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
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },

  // Forma de pagamento
  pagamentoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  iconeWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeWrapSelecionado: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  pagamentoInfo: {
    flex: 1,
  },
  pagamentoTitulo: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  pagamentoSubtitulo: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  // Radio
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelecionado: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },

  // Erro
  erro: {
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 4,
  },

  // Ações
  actions: {
    gap: theme.spacing.sm,
  },
});
