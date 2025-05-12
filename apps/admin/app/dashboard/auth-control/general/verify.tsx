'use client';

import { getVerifyConfig, updateVerifyConfig } from '@/services/admin/system';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function Verify() {
  const t = useTranslations('auth-control.verify');

  const { data, refetch } = useQuery({
    queryKey: ['getVerifyConfig'],
    queryFn: async () => {
      const { data } = await getVerifyConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateVerifyConfig({
        ...data,
        [key]: value,
      } as API.VerifyConfig);
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {
      /* empty */
    }
  }

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>{t('verifySettings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Label>Turnstile Site Key</Label>
                <p className='text-muted-foreground text-xs'>{t('turnstileSiteKeyDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  placeholder={t('inputPlaceholder')}
                  value={data?.turnstile_site_key}
                  onValueBlur={(value) => updateConfig('turnstile_site_key', value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>Turnstile Site Secret</Label>
                <p className='text-muted-foreground text-xs'>{t('turnstileSecretDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  placeholder={t('inputPlaceholder')}
                  value={data?.turnstile_secret}
                  onValueBlur={(value) => updateConfig('turnstile_secret', value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('registrationVerificationCode')}</Label>
                <p className='text-muted-foreground text-xs'>
                  {t('registrationVerificationCodeDescription')}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <Switch
                  checked={data?.enable_register_verify}
                  onCheckedChange={(checked) => {
                    updateConfig('enable_register_verify', checked);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('loginVerificationCode')}</Label>
                <p className='text-muted-foreground text-xs'>
                  {t('loginVerificationCodeDescription')}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <Switch
                  checked={data?.enable_login_verify}
                  onCheckedChange={(checked) => {
                    updateConfig('enable_login_verify', checked);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('resetPasswordVerificationCode')}</Label>
                <p className='text-muted-foreground text-xs'>
                  {t('resetPasswordVerificationCodeDescription')}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <Switch
                  checked={data?.enable_reset_password_verify}
                  onCheckedChange={(checked) => {
                    updateConfig('enable_reset_password_verify', checked);
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
