import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';

export default function ContaScreen() {
  const router = useRouter();

  return (
    <ScreenContainer showFooter currentRoute="/conta">
      <View style={styles.accountCard}>
        <Text style={styles.accountTitle}>Conta</Text>
        <Text style={styles.accountText}>Nome: Aluno FIAP</Text>
        <Text style={styles.accountText}>RM: 12345</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Sair" onPress={() => router.replace('/login')} />
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
