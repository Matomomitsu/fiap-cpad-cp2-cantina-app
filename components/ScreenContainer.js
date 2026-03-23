import { StyleSheet, View } from 'react-native';

import { AppFooter } from './AppFooter';
import { theme } from '../styles/theme';

export function ScreenContainer({
  children,
  currentRoute,
  showFooter = false,
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.body}>{children}</View>
      </View>

      {showFooter ? <AppFooter currentRoute={currentRoute} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  body: {
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
});
