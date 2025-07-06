export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
  data?: any;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.checkPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(options: NotificationOptions): Promise<Notification | null> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser');
      return null;
    }

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission denied');
        return null;
      }
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon.png',
        badge: options.badge || '/icon.png',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        data: options.data
      });

      // Auto close after 5 seconds unless requireInteraction is true
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  async showTaskReminder(taskTitle: string, dueDate?: string): Promise<Notification | null> {
    const body = dueDate 
      ? `Tu tarea "${taskTitle}" vence el ${new Date(dueDate).toLocaleDateString()}`
      : `Recordatorio: "${taskTitle}"`;

    return this.showNotification({
      title: 'ReMi - Recordatorio de Tarea',
      body,
      icon: '/icon.png',
      tag: 'task-reminder',
      requireInteraction: false
    });
  }

  async showGoalReminder(goalTitle: string): Promise<Notification | null> {
    return this.showNotification({
      title: 'ReMi - Meta Semanal',
      body: `¡No olvides tu meta: "${goalTitle}"!`,
      icon: '/icon.png',
      tag: 'goal-reminder',
      requireInteraction: false
    });
  }

  async showAchievementUnlocked(achievementTitle: string, reward: number): Promise<Notification | null> {
    return this.showNotification({
      title: 'ReMi - ¡Logro Desbloqueado!',
      body: `¡Felicidades! Desbloqueaste "${achievementTitle}" y ganaste ${reward} tokens REMI`,
      icon: '/icon.png',
      tag: 'achievement',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Ver Logros'
        }
      ]
    });
  }

  async showTaskCompleted(taskTitle: string, reward: number): Promise<Notification | null> {
    return this.showNotification({
      title: 'ReMi - ¡Tarea Completada!',
      body: `¡Excelente! Completaste "${taskTitle}" y ganaste ${reward} tokens REMI`,
      icon: '/icon.png',
      tag: 'task-completed',
      requireInteraction: false
    });
  }

  async showGoalCompleted(goalTitle: string, reward: number): Promise<Notification | null> {
    return this.showNotification({
      title: 'ReMi - ¡Meta Alcanzada!',
      body: `¡Increíble! Alcanzaste tu meta "${goalTitle}" y ganaste ${reward} tokens REMI`,
      icon: '/icon.png',
      tag: 'goal-completed',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Ver Metas'
        }
      ]
    });
  }

  async showStreakBonus(streakDays: number, bonus: number): Promise<Notification | null> {
    return this.showNotification({
      title: 'ReMi - ¡Bonus de Racha!',
      body: `¡${streakDays} días consecutivos! Ganaste ${bonus} tokens extra por tu consistencia`,
      icon: '/icon.png',
      tag: 'streak-bonus',
      requireInteraction: false
    });
  }

  async showFarcasterShareReward(reward: number): Promise<Notification | null> {
    return this.showNotification({
      title: 'ReMi - ¡Compartiste en Farcaster!',
      body: `Gracias por compartir. Ganaste ${reward} tokens REMI por tu contribución social`,
      icon: '/icon.png',
      tag: 'farcaster-share',
      requireInteraction: false
    });
  }

  // Schedule a notification for a specific time
  scheduleNotification(options: NotificationOptions, scheduledTime: Date): number {
    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      console.warn('Scheduled time is in the past');
      return -1;
    }

    return setTimeout(() => {
      this.showNotification(options);
    }, delay);
  }

  // Cancel a scheduled notification
  cancelScheduledNotification(timeoutId: number): void {
    clearTimeout(timeoutId);
  }

  // Check if notifications are supported and enabled
  isSupported(): boolean {
    return 'Notification' in window;
  }

  isEnabled(): boolean {
    return this.permission === 'granted';
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }
}

// Export a singleton instance
export const notificationService = NotificationService.getInstance();

// Utility functions for common notifications
export const showTaskReminder = (taskTitle: string, dueDate?: string) => 
  notificationService.showTaskReminder(taskTitle, dueDate);

export const showGoalReminder = (goalTitle: string) => 
  notificationService.showGoalReminder(goalTitle);

export const showAchievementUnlocked = (achievementTitle: string, reward: number) => 
  notificationService.showAchievementUnlocked(achievementTitle, reward);

export const showTaskCompleted = (taskTitle: string, reward: number) => 
  notificationService.showTaskCompleted(taskTitle, reward);

export const showGoalCompleted = (goalTitle: string, reward: number) => 
  notificationService.showGoalCompleted(goalTitle, reward);

export const showStreakBonus = (streakDays: number, bonus: number) => 
  notificationService.showStreakBonus(streakDays, bonus);

export const showFarcasterShareReward = (reward: number) => 
  notificationService.showFarcasterShareReward(reward); 