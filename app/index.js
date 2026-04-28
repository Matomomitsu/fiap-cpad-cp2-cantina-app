import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useUser } from '../contexts/UserContext';
import { theme } from '../styles/theme';

export default function Index() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Se já tem sessão ativa, vai direto pro cardápio
  if (user) {
    return <Redirect href="/tabs/cardapio" />;
  }

  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
