import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: Date): string {
  return format(date, 'PPP p', { locale: es });
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}

export function isOverdue(date: Date): boolean {
  return new Date() > date;
}

export function isDueSoon(date: Date, hours: number = 24): boolean {
  const now = new Date();
  const dueSoon = new Date(date.getTime() - hours * 60 * 60 * 1000);
  return now > dueSoon && !isOverdue(date);
}