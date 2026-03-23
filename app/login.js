import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.heroCard}>
        <Image source={require('../assets/images/icon.png')} style={styles.heroImage} resizeMode="contain" />
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Bem-vindo</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Login" onPress={() => router.push('/cardapio')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  heroCopy: {
    gap: theme.spacing.xs,
  },
  heroImage: {
    height: 72,
    width: 72,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
