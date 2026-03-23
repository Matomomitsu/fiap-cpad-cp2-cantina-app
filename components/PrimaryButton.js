import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '../styles/theme';

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  style,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        styles.buttonShadow,
        disabled && styles.disabledButton,
        style,
      ]}>
      <View style={styles.buttonFill}>
        <View style={styles.topTint} />
        <View style={styles.bottomTint} />
        <Text style={[styles.label, styles.buttonLabel]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.pill,
    minHeight: 64,
    width: '100%',
  },
  buttonShadow: {
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  buttonFill: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 20,
  },
  topTint: {
    backgroundColor: theme.colors.primaryAlt,
    height: '72%',
    left: 0,
    opacity: 0.32,
    position: 'absolute',
    right: 0,
    top: 0,
    transform: [{ skewY: '-7deg' }],
  },
  bottomTint: {
    backgroundColor: '#C90F4E',
    bottom: -12,
    height: '58%',
    left: 0,
    opacity: 0.22,
    position: 'absolute',
    right: 0,
    transform: [{ skewY: '7deg' }],
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    zIndex: 1,
  },
  buttonLabel: {
    color: theme.colors.text,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
