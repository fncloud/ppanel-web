'use client';

import { getSubscribeList } from '@/services/admin/subscribe';
import { getRegisterConfig, updateRegisterConfig } from '@/services/admin/system';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Switch } from '@workspace/ui/components/switch';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import { Combobox } from '@workspace/ui/custom-components/combobox';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function Register() {
  const t = useTranslations('auth-control.register');

  const { data, refetch } = useQuery({
    queryKey: ['getRegisterConfig'],
    queryFn: async () => {
      const { data } = await getRegisterConfig();

      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    await updateRegisterConfig({
      ...data,
      [key]: value,
    } as API.RegisterConfig);
    toast.success(t('saveSuccess'));
    refetch();
  }

  const { data: subscribe } = useQuery({
    queryKey: ['getSubscribeList', 'all'],
    queryFn: async () => {
      const { data } = await getSubscribeList({
        page: 1,
        size: 9999,
      });
      return data.data?.list as API.Subscribe[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('registerSettings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Label>{t('stopNewUserRegistration')}</Label>
                <p className='text-muted-foreground text-xs'>
                  {t('stopNewUserRegistrationDescription')}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <Switch
                  checked={data?.stop_register}
                  onCheckedChange={(checked) => {
                    updateConfig('stop_register', checked);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('ipRegistrationLimit')}</Label>
                <p className='text-muted-foreground text-xs'>
                  {t('ipRegistrationLimitDescription')}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <Switch
                  checked={data?.enable_ip_register_limit}
                  onCheckedChange={(checked) => {
                    updateConfig('enable_ip_register_limit', checked);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('registrationLimitCount')}</Label>
                <p className='text-muted-foreground text-xs'>
                  {t('registrationLimitCountDescription')}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  type='number'
                  min={0}
                  value={data?.ip_register_limit}
                  onValueBlur={(value) => updateConfig('ip_register_limit', value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('penaltyTime')}</Label>
                <p className='text-muted-foreground text-xs'>{t('penaltyTimeDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  type='number'
                  min={0}
                  value={data?.ip_register_limit_duration}
                  onValueBlur={(value) => updateConfig('ip_register_limit_duration', value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('trialRegistration')}</Label>
                <p className='text-muted-foreground text-xs'>{t('trialRegistrationDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <Switch
                  checked={data?.enable_trial}
                  onCheckedChange={(checked) => {
                    updateConfig('enable_trial', checked);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('trialSubscribePlan')}</Label>
                <p className='text-muted-foreground text-xs'>
                  {t('trialSubscribePlanDescription')}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  placeholder={t('trialDuration')}
                  type='number'
                  min={0}
                  value={data?.trial_time}
                  onValueBlur={(value) => updateConfig('trial_time', value)}
                  prefix={
                    <Select
                      value={String(data?.trial_subscribe)}
                      onValueChange={(value) => updateConfig('trial_subscribe', Number(value))}
                    >
                      <SelectTrigger className='bg-secondary rounded-r-none'>
                        {data?.trial_subscribe ? (
                          <SelectValue placeholder='Select Subscribe' />
                        ) : (
                          'Select Subscribe'
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {subscribe?.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  }
                  suffix={
                    <Combobox
                      className='bg-secondary rounded-l-none'
                      value={data?.trial_time_unit}
                      onChange={(value) => {
                        if (value) {
                          updateConfig('trial_time_unit', value);
                        }
                      }}
                      options={[
                        { label: t('noLimit'), value: 'NoLimit' },
                        { label: t('year'), value: 'Year' },
                        { label: t('month'), value: 'Month' },
                        { label: t('day'), value: 'Day' },
                        { label: t('hour'), value: 'Hour' },
                        { label: t('minute'), value: 'Minute' },
                      ]}
                    />
                  }
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
