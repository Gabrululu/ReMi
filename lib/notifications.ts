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
  private static instance: NotificationService | null = null;
  private permission: NotificationPermission = 'default';

  private constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.checkPermission();
    }
  }

  static getInstance(): NotificationService | null {
    if (typeof window === 'undefined' || !('Notification' in window)) return null;
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async checkPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notifications not supported in this environment');
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
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notifications not supported in this environment');
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
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }
      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  async showTaskReminder(taskTitle: string, dueDate?: string) {
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

  async showGoalReminder(goalTitle: string) {
    return this.showNotification({
      title: 'ReMi - Meta Semanal',
      body: `¡No olvides tu meta: "${goalTitle}"!`,
      icon: '/icon.png',
      tag: 'goal-reminder',
      requireInteraction: false
    });
  }

  async showAchievementUnlocked(achievementTitle: string, reward: number) {
    return this.showNotification({
      title: 'ReMi - ¡Logro Desbloqueado!',
      body: `¡Felicidades! Desbloqueaste "${achievementTitle}" y ganaste ${reward} tokens REMI`,
      icon: '/icon.png',
      tag: 'achievement',
      requireInteraction: true,
      actions: [{ action: 'view', title: 'Ver Logros' }]
    });
  }

  async showTaskCompleted(taskTitle: string, reward: number) {
    return this.showNotification({
      title: 'ReMi - ¡Tarea Completada!',
      body: `¡Excelente! Completaste "${taskTitle}" y ganaste ${reward} tokens REMI`,
      icon: '/icon.png',
      tag: 'task-completed',
      requireInteraction: false
    });
  }

  async showGoalCompleted(goalTitle: string, reward: number) {
    return this.showNotification({
      title: 'ReMi - ¡Meta Alcanzada!',
      body: `¡Increíble! Alcanzaste tu meta "${goalTitle}" y ganaste ${reward} tokens REMI`,
      icon: '/icon.png',
      tag: 'goal-completed',
      requireInteraction: true,
      actions: [{ action: 'view', title: 'Ver Metas' }]
    });
  }

  async showStreakBonus(streakDays: number, bonus: number) {
    return this.showNotification({
      title: 'ReMi - ¡Bonus de Racha!',
      body: `¡${streakDays} días consecutivos! Ganaste ${bonus} tokens extra por tu consistencia`,
      icon: '/icon.png',
      tag: 'streak-bonus',
      requireInteraction: false
    });
  }

  async showFarcasterShareReward(reward: number) {
    return this.showNotification({
      title: 'ReMi - ¡Compartiste en Farcaster!',
      body: `Gracias por compartir. Ganaste ${reward} tokens REMI por tu contribución social`,
      icon: '/icon.png',
      tag: 'farcaster-share',
      requireInteraction: false
    });
  }

  scheduleNotification(options: NotificationOptions, scheduledTime: Date): number {
    const delay = scheduledTime.getTime() - Date.now();
    if (delay <= 0) {
      console.warn('Scheduled time is in the past');
      return -1;
    }
    return setTimeout(() => { this.showNotification(options); }, delay) as unknown as number;
  }

  cancelScheduledNotification(timeoutId: number): void {
    clearTimeout(timeoutId);
  }

  isSupported(): boolean { return typeof window !== 'undefined' && 'Notification' in window; }
  isEnabled(): boolean { return this.permission === 'granted'; }
  getPermissionStatus(): NotificationPermission { return this.permission; }
}

// ⚠️ Named export que tus componentes están esperando
export const notificationService = {
  requestPermission: () => NotificationService.getInstance()?.requestPermission() ?? Promise.resolve(false),
  showTaskReminder: (title: string, due?: string) => NotificationService.getInstance()?.showTaskReminder(title, due) ?? null,
  showGoalReminder: (title: string) => NotificationService.getInstance()?.showGoalReminder(title) ?? null,
  showAchievementUnlocked: (t: string, r: number) => NotificationService.getInstance()?.showAchievementUnlocked(t, r) ?? null,
  showTaskCompleted: (t: string, r: number) => NotificationService.getInstance()?.showTaskCompleted(t, r) ?? null,
  showGoalCompleted: (t: string, r: number) => NotificationService.getInstance()?.showGoalCompleted(t, r) ?? null,
  showStreakBonus: (d: number, b: number) => NotificationService.getInstance()?.showStreakBonus(d, b) ?? null,
  showFarcasterShareReward: (r: number) => NotificationService.getInstance()?.showFarcasterShareReward(r) ?? null,
};

// (Opcionales) helpers directos si quieres usarlos en otros lados
export const showTaskReminder = (title: string, due?: string) =>
  NotificationService.getInstance()?.showTaskReminder(title, due) ?? null;
export const showGoalReminder = (title: string) =>
  NotificationService.getInstance()?.showGoalReminder(title) ?? null;
export const showAchievementUnlocked = (t: string, r: number) =>
  NotificationService.getInstance()?.showAchievementUnlocked(t, r) ?? null;
export const showTaskCompleted = (t: string, r: number) =>
  NotificationService.getInstance()?.showTaskCompleted(t, r) ?? null;
export const showGoalCompleted = (t: string, r: number) =>
  NotificationService.getInstance()?.showGoalCompleted(t, r) ?? null;
export const showStreakBonus = (d: number, b: number) =>
  NotificationService.getInstance()?.showStreakBonus(d, b) ?? null;
export const showFarcasterShareReward = (r: number) =>
  NotificationService.getInstance()?.showFarcasterShareReward(r) ?? null;
