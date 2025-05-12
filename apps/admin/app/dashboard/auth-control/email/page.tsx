'use client';

import {
  getAuthMethodConfig,
  testEmailSend,
  updateAuthMethodConfig,
} from '@/services/admin/authMethod';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Textarea } from '@workspace/ui/components/textarea';
import { HTMLEditor } from '@workspace/ui/custom-components/editor';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { LogsTable } from '../log';

export default function Page() {
  const t = useTranslations('email');
  const ref = useRef<Partial<API.AuthMethodConfig>>({});
  const [email, setEmail] = useState<string>();

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['getAuthMethodConfig', 'email'],
    queryFn: async () => {
      const { data } = await getAuthMethodConfig({
        method: 'email',
      });
      ref.current = data.data as API.AuthMethodConfig;
      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateAuthMethodConfig({
        ...ref.current,
        [key]: value,
      } as API.UpdateAuthMethodConfigRequest);
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {
      toast.error(t('saveFailed'));
    }
  }

  return (
    <Tabs defaultValue='settings'>
      <TabsList className='h-full flex-wrap'>
        <TabsTrigger value='settings'>{t('settings')}</TabsTrigger>
        <TabsTrigger value='template'>{t('template')}</TabsTrigger>
        <TabsTrigger value='logs'>{t('logs')}</TabsTrigger>
      </TabsList>
      <TabsContent value='settings'>
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
                <Label>{t('emailVerification')}</Label>
                <p className='text-muted-foreground text-xs'>{t('emailVerificationDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <Switch
                  checked={data?.config?.enable_verify}
                  onCheckedChange={(checked) =>
                    updateConfig('config', { ...data?.config, enable_verify: checked })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('emailSuffixWhitelist')}</Label>
                <p className='text-muted-foreground text-xs'>
                  {t('emailSuffixWhitelistDescription')}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <Switch
                  checked={data?.config?.enable_domain_suffix}
                  onCheckedChange={(checked) =>
                    updateConfig('config', { ...data?.config, enable_domain_suffix: checked })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='align-top'>
                <Label>{t('whitelistSuffixes')}</Label>
                <p className='text-muted-foreground text-xs'>{t('whitelistSuffixesDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <Textarea
                  className='h-32'
                  placeholder={t('whitelistSuffixesPlaceholder')}
                  defaultValue={data?.config?.domain_suffix_list}
                  onBlur={(e) =>
                    updateConfig('config', { ...data?.config, domain_suffix_list: e.target.value })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('smtpServerAddress')}</Label>
                <p className='text-muted-foreground text-xs'>{t('smtpServerAddressDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  placeholder={t('inputPlaceholder')}
                  value={data?.config?.platform_config?.host}
                  onValueBlur={(value) =>
                    updateConfig('config', {
                      ...data?.config,
                      platform_config: {
                        ...data?.platform_config,
                        host: value,
                      },
                    })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('smtpServerPort')}</Label>
                <p className='text-muted-foreground text-xs'>{t('smtpServerPortDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  placeholder={t('inputPlaceholder')}
                  value={data?.config?.platform_config?.port}
                  type='number'
                  onValueBlur={(value) =>
                    updateConfig('config', {
                      ...data?.config,
                      platform_config: {
                        ...ref.current?.config?.platform_config,
                        port: value,
                      },
                    })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('smtpEncryptionMethod')}</Label>
                <p className='text-muted-foreground text-xs'>
                  {t('smtpEncryptionMethodDescription')}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <Switch
                  checked={data?.config?.platform_config?.ssl}
                  onCheckedChange={(checked) =>
                    updateConfig('config', {
                      ...data?.config,
                      platform_config: {
                        ...ref.current?.config?.platform_config,
                        ssl: checked,
                      },
                    })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('smtpAccount')}</Label>
                <p className='text-muted-foreground text-xs'>{t('smtpAccountDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  placeholder={t('inputPlaceholder')}
                  value={data?.config?.platform_config?.user}
                  onValueBlur={(value) =>
                    updateConfig('config', {
                      ...data?.config,
                      platform_config: {
                        ...ref.current?.config?.platform_config,
                        user: value,
                      },
                    })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('smtpPassword')}</Label>
                <p className='text-muted-foreground text-xs'>{t('smtpPasswordDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  placeholder={t('inputPlaceholder')}
                  value={data?.config?.platform_config?.pass}
                  type='password'
                  onValueBlur={(value) =>
                    updateConfig('config', {
                      ...data?.config,
                      platform_config: {
                        ...ref.current?.config?.platform_config,
                        pass: value,
                      },
                    })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('senderAddress')}</Label>
                <p className='text-muted-foreground text-xs'>{t('senderAddressDescription')}</p>
              </TableCell>
              <TableCell className='text-right'>
                <EnhancedInput
                  placeholder={t('inputPlaceholder')}
                  value={data?.config?.platform_config?.from}
                  onValueBlur={(value) =>
                    updateConfig('config', {
                      ...data?.config,
                      platform_config: {
                        ...ref.current?.config?.platform_config,
                        from: value,
                      },
                    })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Label>{t('sendTestEmail')}</Label>
                <p className='text-muted-foreground text-xs'>{t('sendTestEmailDescription')}</p>
              </TableCell>
              <TableCell className='flex items-center gap-2 text-right'>
                <EnhancedInput
                  placeholder='test@example.com'
                  value={email}
                  type='email'
                  onValueChange={(value) => setEmail(value as string)}
                />
                <Button
                  disabled={!email || isFetching}
                  onClick={async () => {
                    if (!email) return;
                    try {
                      await testEmailSend({ email });
                      toast.success(t('sendSuccess'));
                    } catch {
                      toast.error(t('sendFailure'));
                    }
                  }}
                >
                  {t('sendTestEmail')}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value='template'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {[
            'verify_email_template',
            'expiration_email_template',
            'maintenance_email_template',
            'traffic_exceed_email_template',
          ].map((templateKey) => (
            <Card key={templateKey}>
              <CardHeader>
                <CardTitle>{t(`${templateKey}`)}</CardTitle>
                <CardDescription>
                  {t(`${templateKey}Description`, { after: '{{', before: '}}' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HTMLEditor
                  placeholder={t('inputPlaceholder')}
                  value={data?.config?.[templateKey] as string}
                  onBlur={(value) =>
                    updateConfig('config', {
                      ...data?.config,
                      [templateKey]: value,
                    })
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value='logs'>
        <LogsTable type='email' />
      </TabsContent>
    </Tabs>
  );
}
