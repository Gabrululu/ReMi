'use client';

import { useState, useEffect } from 'react';
import { notificationService } from '../lib/notifications';

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    setIsEnabled(notificationService.isEnabled());
    setPermission(notificationService.getPermissionStatus());
  }, []);

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setIsEnabled(granted);
    setPermission(notificationService.getPermissionStatus());
    return granted;
  };

  const showNotification = async (options: {
    title: string;
    body: string;
    icon?: string;
    requireInteraction?: boolean;
  }) => {
    if (!isEnabled) {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    return notificationService.showNotification(options);
  };

  const showTaskReminder = async (taskTitle: string, dueDate?: string) => {
    return notificationService.showTaskReminder(taskTitle, dueDate);
  };

  const showGoalReminder = async (goalTitle: string) => {
    return notificationService.showGoalReminder(goalTitle);
  };

  const showAchievementUnlocked = async (achievementTitle: string, reward: number) => {
    return notificationService.showAchievementUnlocked(achievementTitle, reward);
  };

  const showTaskCompleted = async (taskTitle: string, reward: number) => {
    return notificationService.showTaskCompleted(taskTitle, reward);
  };

  const showGoalCompleted = async (goalTitle: string, reward: number) => {
    return notificationService.showGoalCompleted(goalTitle, reward);
  };

  const showStreakBonus = async (streakDays: number, bonus: number) => {
    return notificationService.showStreakBonus(streakDays, bonus);
  };

  const showFarcasterShareReward = async (reward: number) => {
    return notificationService.showFarcasterShareReward(reward);
  };

  const scheduleNotification = (
    options: {
      title: string;
      body: string;
      icon?: string;
    },
    scheduledTime: Date
  ) => {
    return notificationService.scheduleNotification(options, scheduledTime);
  };

  const cancelScheduledNotification = (timeoutId: number) => {
    notificationService.cancelScheduledNotification(timeoutId);
  };

  return {
    isSupported,
    isEnabled,
    permission,
    requestPermission,
    showNotification,
    showTaskReminder,
    showGoalReminder,
    showAchievementUnlocked,
    showTaskCompleted,
    showGoalCompleted,
    showStreakBonus,
    showFarcasterShareReward,
    scheduleNotification,
    cancelScheduledNotification
  };
} 