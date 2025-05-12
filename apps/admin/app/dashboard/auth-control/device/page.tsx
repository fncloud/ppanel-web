'use client';

import { getAuthMethodConfig, updateAuthMethodConfig } from '@/services/admin/authMethod';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { DicesIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { uid } from 'radash';
import { toast } from 'sonner';

export default function Page() {
  const t = useTranslations('device');

  const { data, refetch } = useQuery({
    queryKey: ['getAuthMethodConfig', 'device'],
    queryFn: async () => {
      const { data } = await getAuthMethodConfig({
        method: 'device',
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
            <Label>{t('showAds')}</Label>
            <p className='text-muted-foreground text-xs'>{t('showAdsDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.config?.show_ads}
              onCheckedChange={(checked) => {
                updateConfig('config', {
                  ...data?.config,
                  show_ads: checked,
                });
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('blockVirtualMachine')}</Label>
            <p className='text-muted-foreground text-xs'>{t('blockVirtualMachineDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.config?.only_real_device}
              onCheckedChange={(checked) => {
                updateConfig('config', {
                  ...data?.config,
                  only_real_device: checked,
                });
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('enableSecurity')}</Label>
            <p className='text-muted-foreground text-xs'>{t('enableSecurityDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.config?.enable_security}
              onCheckedChange={(checked) => {
                updateConfig('config', {
                  ...data?.config,
                  enable_security: checked,
                });
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('communicationKey')}</Label>
            <p className='text-muted-foreground text-xs'>{t('communicationKeyDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              value={data?.config?.security_secret}
              onValueBlur={(value) => {
                updateConfig('config', {
                  ...data?.config,
                  security_secret: value,
                });
              }}
              suffix={
                <div className='bg-muted flex h-9 items-center text-nowrap px-3'>
                  <DicesIcon
                    onClick={() => {
                      const id = uid(32).toLowerCase();
                      const formatted = `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
                      updateConfig('config', {
                        ...data?.config,
                        security_secret: formatted,
                      });
                    }}
                    className='cursor-pointer'
                  />
                </div>
              }
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
