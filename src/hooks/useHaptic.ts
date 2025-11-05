import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { useAppStore } from '@stores/index';

export const useHaptic = () => {
  const { settings } = useAppStore();

  const light = async () => {
    if (!settings.hapticEnabled || !Capacitor.isNativePlatform()) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const medium = async () => {
    if (!settings.hapticEnabled || !Capacitor.isNativePlatform()) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const heavy = async () => {
    if (!settings.hapticEnabled || !Capacitor.isNativePlatform()) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const success = async () => {
    if (!settings.hapticEnabled || !Capacitor.isNativePlatform()) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const warning = async () => {
    if (!settings.hapticEnabled || !Capacitor.isNativePlatform()) return;
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const error = async () => {
    if (!settings.hapticEnabled || !Capacitor.isNativePlatform()) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const selection = async () => {
    if (!settings.hapticEnabled || !Capacitor.isNativePlatform()) return;
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  // Web fallback using Vibration API
  const vibrate = (pattern: number | number[]) => {
    if (!settings.hapticEnabled) return;

    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
    vibrate,
  };
};

// Hook for automatic haptic feedback on user interactions
export const useHapticFeedback = () => {
  const haptic = useHaptic();

  const onButtonPress = () => {
    haptic.light();
  };

  const onSuccess = () => {
    haptic.success();
  };

  const onError = () => {
    haptic.error();
  };

  const onSelection = () => {
    haptic.selection();
  };

  const onAchievement = () => {
    haptic.medium();
    setTimeout(() => haptic.success(), 100);
  };

  const onGameWin = () => {
    haptic.heavy();
    setTimeout(() => haptic.success(), 200);
    setTimeout(() => haptic.success(), 400);
  };

  const onCardFlip = () => {
    haptic.light();
  };

  const onCorrectAnswer = () => {
    haptic.success();
  };

  const onWrongAnswer = () => {
    haptic.warning();
    setTimeout(() => haptic.light(), 100);
  };

  return {
    onButtonPress,
    onSuccess,
    onError,
    onSelection,
    onAchievement,
    onGameWin,
    onCardFlip,
    onCorrectAnswer,
    onWrongAnswer,
  };
};

// Hook for haptic patterns
export const useHapticPatterns = () => {
  const haptic = useHaptic();

  const heartbeat = async () => {
    await haptic.light();
    setTimeout(() => haptic.light(), 150);
    setTimeout(() => haptic.light(), 300);
  };

  const doubleTap = async () => {
    await haptic.light();
    setTimeout(() => haptic.light(), 100);
  };

  const tripleTap = async () => {
    await haptic.light();
    setTimeout(() => haptic.light(), 100);
    setTimeout(() => haptic.light(), 200);
  };

  const longPress = async () => {
    await haptic.medium();
    setTimeout(() => haptic.heavy(), 100);
  };

  const celebration = async () => {
    await haptic.success();
    setTimeout(() => haptic.light(), 200);
    setTimeout(() => haptic.light(), 400);
    setTimeout(() => haptic.medium(), 600);
    setTimeout(() => haptic.success(), 800);
  };

  const countdown = async () => {
    await haptic.light();
    setTimeout(() => haptic.light(), 500);
    setTimeout(() => haptic.light(), 1000);
    setTimeout(() => haptic.light(), 1500);
    setTimeout(() => haptic.medium(), 2000);
  };

  const typing = async () => {
    await haptic.selection();
  };

  const scroll = async () => {
    await haptic.light();
  };

  return {
    heartbeat,
    doubleTap,
    tripleTap,
    longPress,
    celebration,
    countdown,
    typing,
    scroll,
  };
};