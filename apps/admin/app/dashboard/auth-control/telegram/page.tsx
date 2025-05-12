'use client';

import { getAuthMethodConfig, updateAuthMethodConfig } from '@/services/admin/authMethod';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function Page() {
  const t = useTranslations('telegram');

  const { data, refetch } = useQuery({
    queryKey: ['getAuthMethodConfig', 'telegram'],
    queryFn: async () => {
      const { data } = await getAuthMethodConfig({
        method: 'telegram',
      });
      return data.data;
    },
  });

  async function updateConfig(key: keyof API.UpdateAuthMethodConfigRequest, value: unknown) {
    try {
      await updateAuthMethodConfig({
        ...data,
        [key]: value,
      } as API.UpdateAuthMethodConfigRequest);
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {
      toast.error(t('saveFailed'));
    }
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Label>{t('enable')}</Label>
            <p className='text-muted-foreground text-xs'>{t('enableDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.enabled}
              onCheckedChange={(checked) => updateConfig('enabled', checked)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('clientId')}</Label>
            <p className='text-muted-foreground text-xs'>{t('clientIdDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder='6123456789'
              value={data?.config?.bot}
              onValueBlur={(value) => {
                updateConfig('config', {
                  ...data?.config,
                  bot: value,
                });
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('clientSecret')}</Label>
            <p className='text-muted-foreground text-xs'>{t('clientSecretDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder='6123456789:AAHn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
              value={data?.config?.bot_token}
              onValueBlur={(value) => {
                updateConfig('config', {
                  ...data?.config,
                  bot_token: value,
                });
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
