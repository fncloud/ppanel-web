'use client';

import { getCurrencyConfig, updateCurrencyConfig } from '@/services/admin/system';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@workspace/ui/components/label';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function Site() {
  const t = useTranslations('system.currency');

  const { data, refetch } = useQuery({
    queryKey: ['getCurrencyConfig'],
    queryFn: async () => {
      const { data } = await getCurrencyConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateCurrencyConfig({
        ...data,
        [key]: value,
      } as API.CurrencyConfig);
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {
      /* empty */
    }
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Label>{t('accessKey')}</Label>
            <p className='text-muted-foreground text-xs'>{t('accessKeyDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              value={data?.access_key}
              onValueBlur={(value) => updateConfig('access_key', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('currencyUnit')}</Label>
            <p className='text-muted-foreground text-xs'>{t('currencyUnitDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder='USD'
              value={data?.currency_unit}
              onValueBlur={(value) => updateConfig('currency_unit', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('currencySymbol')}</Label>
            <p className='text-muted-foreground text-xs'>{t('currencySymbolDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder='$'
              value={data?.currency_symbol}
              onValueBlur={(value) => updateConfig('currency_symbol', value)}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
