import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date: string) =>
  format(parseISO(date), 'dd MMM yyyy');

export const formatDateTime = (date: string) =>
  format(parseISO(date), 'dd MMM yyyy, hh:mm a');

export const timeAgo = (date: string) =>
  formatDistanceToNow(parseISO(date), { addSuffix: true });