'use client';

import { getVerifyCodeConfig, updateVerifyCodeConfig } from '@/services/admin/system';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function VerifyCode() {
  const t = useTranslations('auth-control.verify-code');

  const { data, refetch } = useQuery({
    queryKey: ['getVerifyCodeConfig'],
    queryFn: async () => {
      const { data } = await getVerifyCodeConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateVerifyCodeConfig({
        ...data,
        [key]: value,
      } as API.VerifyCodeConfig);
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {
      /* empty */
    }
  }

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>{t('verifyCodeSettings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Label>{t('expireTime')}</Label>
                <p className='text-muted-foreground text-xs'>{t('expireTimeDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  type='number'
                  placeholder='300'
                  value={data?.verify_code_expire_time}
                  onValueBlur={(value) => updateConfig('verify_code_expire_time', Number(value))}
                  suffix={t('second')}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('interval')}</Label>
                <p className='text-muted-foreground text-xs'>{t('intervalDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  type='number'
                  placeholder='60'
                  value={data?.verify_code_interval}
                  onValueBlur={(value) => updateConfig('verify_code_interval', Number(value))}
                  suffix={t('second')}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('dailyLimit')}</Label>
                <p className='text-muted-foreground text-xs'>{t('dailyLimitDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  type='number'
                  placeholder='15'
                  value={data?.verify_code_limit}
                  onValueBlur={(value) => updateConfig('verify_code_limit', Number(value))}
                  suffix={t('times')}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
