import { differenceInMilliseconds, intlFormat } from 'date-fns';

export function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

export function formatDate(date?: Date | number, showTime: boolean = true) {
  if (!date) return;
  return intlFormat(date, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    ...(showTime && {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }),
    hour12: false,
  });
}

export function differenceInDays(dateLeft: Date | number, dateRight: Date | number) {
  const diffInMs = differenceInMilliseconds(dateLeft, dateRight);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  if (diffInDays >= 1) return diffInDays.toFixed(0);
  return Number(diffInDays.toFixed(2));
}
