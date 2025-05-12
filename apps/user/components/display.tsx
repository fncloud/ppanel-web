'use client';

import useGlobalStore from '@/config/use-global';
import { formatBytes, unitConversion } from '@workspace/ui/utils';
import { useTranslations } from 'next-intl';

type DisplayType = 'currency' | 'traffic' | 'number' | 'trafficSpeed';

interface DisplayProps<T> {
  value?: T;
  unlimited?: boolean;
  type?: DisplayType;
}

export function Display<T extends number | undefined | null>({
  value = 0,
  unlimited = false,
  type = 'number',
}: DisplayProps<T>): string {
  const t = useTranslations('common');
  const { common } = useGlobalStore();
  const { currency } = common;

  if (type === 'currency') {
    const formattedValue = `${currency?.currency_symbol ?? ''}${unitConversion('centsToDollars', value as number)?.toFixed(2) ?? '0.00'}`;
    return formattedValue;
  }

  if (['traffic', 'trafficSpeed', 'number'].includes(type) && unlimited && !value) {
    return t('unlimited');
  }

  if (type === 'traffic') {
    return value ? formatBytes(value) : '0';
  }

  if (type === 'trafficSpeed') {
    return value ? formatBytes(value).replace('B', 'b') + 'ps' : '0';
  }

  if (type === 'number') {
    return value ? value.toString() : '0';
  }

  return '0';
}
