import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/AppStore';

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'soft' | 'rigid';
type NotificationType = 'success' | 'warning' | 'error';

export function useHaptics() {
  const { state } = useAppStore();
  const enabled = state.preferences.hapticsEnabled;

  const impact = useCallback(
    (style: ImpactStyle = 'light') => {
      if (!enabled) return;
      const map = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
        soft: Haptics.ImpactFeedbackStyle.Soft,
        rigid: Haptics.ImpactFeedbackStyle.Rigid,
      } as const;
      Haptics.impactAsync(map[style]).catch(() => {});
    },
    [enabled]
  );

  const notify = useCallback(
    (type: NotificationType = 'success') => {
      if (!enabled) return;
      const map = {
        success: Haptics.NotificationFeedbackType.Success,
        warning: Haptics.NotificationFeedbackType.Warning,
        error: Haptics.NotificationFeedbackType.Error,
      } as const;
      Haptics.notificationAsync(map[type]).catch(() => {});
    },
    [enabled]
  );

  const select = useCallback(() => {
    if (!enabled) return;
    Haptics.selectionAsync().catch(() => {});
  }, [enabled]);

  return { impact, notify, select };
}
