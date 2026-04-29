import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Mostra a notificação mesmo com o app em foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let permissionRequested = false;
const readyNotificationKeys = new Set();

export async function ensureNotificationPermissions() {
  if (Platform.OS === 'web') return false;

  const { status: current } = await Notifications.getPermissionsAsync();
  if (current === 'granted') return true;

  if (permissionRequested) return false;
  permissionRequested = true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('pedidos', {
    name: 'Pedidos',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#ED145B',
  });
}

function dateTrigger(fireAt) {
  return {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: fireAt,
    channelId: 'pedidos',
  };
}

export async function schedulePreparingNotification(senha, fireAt) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Seu pedido está sendo preparado',
      body: `Senha #${senha} — a cantina já começou seu pedido.`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: { tipo: 'preparando', senha },
    },
    trigger: dateTrigger(fireAt),
  });
}

export async function sendReadyNotificationNow(senha, notificationKey = senha) {
  if (readyNotificationKeys.has(notificationKey)) {
    return null;
  }

  readyNotificationKeys.add(notificationKey);

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pedido pronto para retirada!',
      body: `Senha #${senha} — dirija-se ao balcão da cantina.`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
      data: { tipo: 'pronto', senha },
    },
    trigger: null,
  });
}

export async function cancelAllPendingNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
