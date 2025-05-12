'use client';

import { getNodeGroupList } from '@/services/admin/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet';
import { Switch } from '@workspace/ui/components/switch';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Combobox } from '@workspace/ui/custom-components/combobox';
import { ArrayInput } from '@workspace/ui/custom-components/dynamic-Inputs';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { Icon } from '@workspace/ui/custom-components/icon';
import TagInput from '@workspace/ui/custom-components/tag-input';
import { cn } from '@workspace/ui/lib/utils';
import { unitConversion } from '@workspace/ui/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formSchema, protocols } from './form-schema';
interface NodeFormProps<T> {
  onSubmit: (data: T) => Promise<boolean> | boolean;
  initialValues?: T;
  loading?: boolean;
  trigger: string;
  title: string;
}

export default function NodeForm<T extends { [x: string]: any }>({
  onSubmit,
  initialValues,
  loading,
  trigger,
  title,
}: Readonly<NodeFormProps<T>>) {
  const t = useTranslations('server.node');

  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: [],
      traffic_ratio: 1,
      protocol: 'shadowsocks',
      ...initialValues,
      config: {
        security: 'none',
        transport: 'tcp',
        ...initialValues?.config,
      },
    } as any,
  });
  const protocol = form.watch('protocol');
  const transport = form.watch('config.transport');
  const security = form.watch('config.security');
  const relayMode = form.watch('relay_mode');
  const method = form.watch('config.method');

  useEffect(() => {
    form?.reset(initialValues);
  }, [form, initialValues]);

  async function handleSubmit(data: { [x: string]: any }) {
    const bool = await onSubmit(data as unknown as T);
    if (bool) setOpen(false);
  }

  const { data: groups } = useQuery({
    queryKey: ['getNodeGroupList'],
    queryFn: async () => {
      const { data } = await getNodeGroupList();
      return (data.data?.list || []) as API.ServerGroup[];
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
            setOpen(true);
          }}
        >
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent className='w-[520px] max-w-full md:max-w-screen-md'>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className='-mx-6 h-[calc(100dvh-48px-36px-36px-env(safe-area-inset-top))]'>
          <Form {...form}>
            <form className='grid grid-cols-1 gap-2 px-6 pt-4'>
              <div className='grid grid-cols-2 gap-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.name')}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(value) => {
                            form.setValue(field.name, value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='group_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.groupId')}</FormLabel>
                      <FormControl>
                        <Combobox<number, false>
                          placeholder={t('form.selectNodeGroup')}
                          {...field}
                          options={groups?.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                          onChange={(value) => {
                            form.setValue(field.name, value || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-5 gap-2'>
                <FormField
                  control={form.control}
                  name='tags'
                  render={({ field }) => (
                    <FormItem className='col-span-3'>
                      <FormLabel>{t('form.tags')}</FormLabel>
                      <FormControl>
                        <TagInput
                          placeholder={t('form.tagsPlaceholder')}
                          value={field.value || []}
                          onChange={(value) => form.setValue(field.name, value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.country')}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(value) => {
                            form.setValue(field.name, value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.city')}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(value) => {
                            form.setValue(field.name, value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-3 gap-2'>
                <FormField
                  control={form.control}
                  name='server_addr'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.serverAddr')}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(value) => {
                            form.setValue(field.name, value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='speed_limit'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.speedLimit')}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          type='number'
                          {...field}
                          placeholder={t('form.speedLimitPlaceholder')}
                          formatInput={(value) => unitConversion('bitsToMb', value)}
                          formatOutput={(value) => unitConversion('mbToBits', value)}
                          onValueChange={(value) => {
                            form.setValue(field.name, value);
                          }}
                          suffix='Mbps'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='traffic_ratio'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.trafficRatio')}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          type='number'
                          onValueChange={(value) => {
                            form.setValue(field.name, value);
                          }}
                          suffix='X'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='protocol'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.protocol')}</FormLabel>
                    <FormControl>
                      <Tabs
                        value={field.value}
                        onValueChange={(value) => {
                          form.setValue(field.name, value);
                          if (['trojan', 'hysteria2', 'tuic'].includes(value)) {
                            form.setValue('config.security', 'tls');
                          }
                        }}
                      >
                        <TabsList className='h-full w-full flex-wrap md:flex-nowrap'>
                          {protocols.map((proto) => (
                            <TabsTrigger value={proto} key={proto}>
                              {proto.charAt(0).toUpperCase() + proto.slice(1)}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {protocol === 'shadowsocks' && (
                <div className='grid grid-cols-2 gap-2'>
                  <FormField
                    control={form.control}
                    name='config.method'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.encryptionMethod')}</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              form.setValue(field.name, value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('form.selectEncryptionMethod')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='aes-128-gcm'>aes-128-gcm</SelectItem>
                              <SelectItem value='aes-192-gcm'>aes-192-gcm</SelectItem>
                              <SelectItem value='aes-256-gcm'>aes-256-gcm</SelectItem>
                              <SelectItem value='chacha20-ietf-poly1305'>
                                chacha20-ietf-poly1305
                              </SelectItem>
                              <SelectItem value='2022-blake3-aes-128-gcm'>
                                2022-blake3-aes-128-gcm
                              </SelectItem>
                              <SelectItem value='2022-blake3-aes-256-gcm'>
                                2022-blake3-aes-256-gcm
                              </SelectItem>
                              <SelectItem value='2022-blake3-chacha20-poly1305'>
                                2022-blake3-chacha20-poly1305
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='config.port'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.port')}</FormLabel>
                        <FormControl>
                          <EnhancedInput
                            {...field}
                            type='number'
                            step={1}
                            min={1}
                            max={65535}
                            placeholder='1-65535'
                            onValueChange={(value) => {
                              form.setValue(field.name, value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {[
                    '2022-blake3-aes-128-gcm',
                    '2022-blake3-aes-256-gcm',
                    '2022-blake3-chacha20-poly1305',
                  ].includes(method) && (
                    <FormField
                      control={form.control}
                      name='config.server_key'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form.serverKey')}</FormLabel>
                          <FormControl>
                            <EnhancedInput
                              {...field}
                              onValueChange={(value) => {
                                form.setValue(field.name, value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {['vmess', 'vless', 'trojan', 'hysteria2', 'tuic'].includes(protocol) && (
                <div className='grid gap-4'>
                  <div
                    className={cn('flex gap-4 *:flex-1', {
                      'grid grid-cols-2': ['hysteria2'].includes(protocol),
                    })}
                  >
                    <FormField
                      control={form.control}
                      name='config.port'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form.port')}</FormLabel>
                          <FormControl>
                            <EnhancedInput
                              {...field}
                              type='number'
                              step={1}
                              min={1}
                              max={65535}
                              placeholder='1-65535'
                              onValueChange={(value) => {
                                form.setValue(field.name, value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {protocol === 'vless' && (
                      <FormField
                        control={form.control}
                        name='config.flow'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.flow')}</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  form.setValue(field.name, value);
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('form.pleaseSelect')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value='none'>NONE</SelectItem>
                                  <SelectItem value='xtls-rprx-vision'>xtls-rprx-vision</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {protocol === 'hysteria2' && (
                      <>
                        <FormField
                          control={form.control}
                          name='config.obfs_password'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('form.obfsPassword')}</FormLabel>
                              <FormControl>
                                <EnhancedInput
                                  {...field}
                                  placeholder={t('form.obfsPasswordPlaceholder')}
                                  onValueChange={(value) => {
                                    form.setValue(field.name, value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='config.hop_ports'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('form.hopPorts')}</FormLabel>
                              <FormControl>
                                <EnhancedInput
                                  placeholder={t('form.hopPortsPlaceholder')}
                                  {...field}
                                  onValueChange={(value) => {
                                    form.setValue(field.name, value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='config.hop_interval'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('form.hopInterval')}</FormLabel>
                              <FormControl>
                                <EnhancedInput
                                  {...field}
                                  type='number'
                                  onValueChange={(value) => {
                                    form.setValue(field.name, value);
                                  }}
                                  suffix='S'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                  {['vmess', 'vless', 'trojan'].includes(protocol) && (
                    <Card>
                      <CardHeader className='flex flex-row items-center justify-between p-3'>
                        <CardTitle>{t('form.transportConfig')}</CardTitle>
                        <FormField
                          control={form.control}
                          name='config.transport'
                          render={({ field }) => (
                            <FormItem className='!mt-0 min-w-32'>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    form.setValue(field.name, value);
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('form.pleaseSelect')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='tcp'>TCP</SelectItem>
                                    <SelectItem value='websocket'>WebSocket</SelectItem>
                                    {['vless'].includes(protocol) && (
                                      <SelectItem value='http2'>HTTP/2</SelectItem>
                                    )}
                                    <SelectItem value='grpc'>gRPC</SelectItem>
                                    {['vmess', 'vless'].includes(protocol) && (
                                      <SelectItem value='httpupgrade'>HTTPUPgrade</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardHeader>
                      {transport !== 'tcp' && (
                        <CardContent className='flex gap-4 p-3'>
                          {['websocket', 'http2', 'httpupgrade'].includes(transport) && (
                            <>
                              <FormField
                                control={form.control}
                                name='config.transport_config.path'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>PATH</FormLabel>
                                    <FormControl>
                                      <EnhancedInput
                                        {...field}
                                        onValueChange={(value) => {
                                          form.setValue(field.name, value);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name='config.transport_config.host'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>HOST</FormLabel>
                                    <FormControl>
                                      <EnhancedInput
                                        {...field}
                                        onValueChange={(value) => {
                                          form.setValue(field.name, value);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}
                          {['grpc'].includes(transport) && (
                            <FormField
                              control={form.control}
                              name='config.transport_config.service_name'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Service Name</FormLabel>
                                  <FormControl>
                                    <EnhancedInput
                                      {...field}
                                      onValueChange={(value) => {
                                        form.setValue(field.name, value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </CardContent>
                      )}
                    </Card>
                  )}
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between p-3'>
                      <CardTitle>{t('form.securityConfig')}</CardTitle>
                      <FormField
                        control={form.control}
                        name='config.security'
                        render={({ field }) => (
                          <FormItem className='!mt-0 min-w-32'>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                form.setValue(field.name, value);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('form.pleaseSelect')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {['vmess', 'vless'].includes(protocol) && (
                                  <SelectItem value='none'>NONE</SelectItem>
                                )}
                                <SelectItem value='tls'>TLS</SelectItem>
                                {protocol === 'vless' && (
                                  <SelectItem value='reality'>Reality</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardHeader>
                    {security !== 'none' && (
                      <CardContent className='grid grid-cols-2 gap-4 p-3'>
                        <FormField
                          control={form.control}
                          name='config.security_config.sni'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Server Name(SNI)</FormLabel>
                              <FormControl>
                                <EnhancedInput
                                  {...field}
                                  onValueChange={(value) => {
                                    form.setValue(field.name, value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {protocol === 'vless' && security === 'reality' && (
                          <>
                            <FormField
                              control={form.control}
                              name='config.security_config.reality_server_addr'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('form.security_config.serverAddress')}</FormLabel>
                                  <FormControl>
                                    <EnhancedInput
                                      {...field}
                                      placeholder={t(
                                        'form.security_config.serverAddressPlaceholder',
                                      )}
                                      onValueChange={(value) => {
                                        form.setValue(field.name, value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='config.security_config.reality_server_port'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('form.security_config.serverPort')}</FormLabel>
                                  <FormControl>
                                    <EnhancedInput
                                      {...field}
                                      type='number'
                                      min={1}
                                      max={65535}
                                      placeholder={t('form.security_config.serverPortPlaceholder')}
                                      onValueChange={(value) => {
                                        form.setValue(field.name, value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='config.security_config.reality_private_key'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('form.security_config.privateKey')}</FormLabel>
                                  <FormControl>
                                    <EnhancedInput
                                      {...field}
                                      placeholder={t('form.security_config.privateKeyPlaceholder')}
                                      onValueChange={(value) => {
                                        form.setValue(field.name, value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='config.security_config.reality_public_key'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('form.security_config.publicKey')}</FormLabel>
                                  <FormControl>
                                    <EnhancedInput
                                      {...field}
                                      placeholder={t('form.security_config.publicKeyPlaceholder')}
                                      onValueChange={(value) => {
                                        form.setValue(field.name, value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='config.security_config.reality_short_id'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('form.security_config.shortId')}</FormLabel>
                                  <FormControl>
                                    <EnhancedInput
                                      {...field}
                                      placeholder={t('form.security_config.shortIdPlaceholder')}
                                      onValueChange={(value) => {
                                        form.setValue(field.name, value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        {protocol === 'vless' && (
                          <FormField
                            control={form.control}
                            name='config.security_config.fingerprint'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.security_config.fingerprint')}</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    form.setValue(field.name, value);
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('form.pleaseSelect')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='chrome'>Chrome</SelectItem>
                                    <SelectItem value='firefox'>Firefox</SelectItem>
                                    <SelectItem value='safari'>Safari</SelectItem>
                                    <SelectItem value='ios'>IOS</SelectItem>
                                    <SelectItem value='android'>Android</SelectItem>
                                    <SelectItem value='edge'>edge</SelectItem>
                                    <SelectItem value='360'>360</SelectItem>
                                    <SelectItem value='qq'>QQ</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        <FormField
                          control={form.control}
                          name='config.security_config.allow_insecure'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Allow Insecure</FormLabel>
                              <FormControl>
                                <div className='pt-2'>
                                  <Switch
                                    checked={!!field.value}
                                    onCheckedChange={(value) => {
                                      form.setValue(field.name, value);
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    )}
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader className='flex flex-row items-center justify-between p-3'>
                  <CardTitle>{t('form.relayMode')}</CardTitle>
                  <FormField
                    control={form.control}
                    name='relay_mode'
                    render={({ field }) => (
                      <FormItem className='!mt-0 min-w-32'>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              form.setValue(field.name, value);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('form.selectRelayMode')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='none'>
                                {t('form.relayModeOptions.none')}
                              </SelectItem>
                              <SelectItem value='all'>{t('form.relayModeOptions.all')}</SelectItem>
                              <SelectItem value='random'>
                                {t('form.relayModeOptions.random')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardHeader>
                {relayMode !== 'none' && (
                  <CardContent className='w-full space-y-3 px-3'>
                    <FormField
                      control={form.control}
                      name='relay_node'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ArrayInput
                              fields={[
                                {
                                  name: 'host',
                                  type: 'text',
                                  placeholder: t('form.relayHost'),
                                },
                                {
                                  name: 'port',
                                  type: 'number',
                                  step: 1,
                                  min: 1,
                                  max: 65535,
                                  placeholder: t('form.relayPort'),
                                },
                                {
                                  name: 'prefix',
                                  type: 'text',
                                  placeholder: t('form.relayPrefix'),
                                },
                              ]}
                              value={field.value}
                              onChange={(value) => {
                                form.setValue(field.name, value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                )}
              </Card>
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className='flex-row justify-end gap-2 pt-3'>
          <Button
            variant='outline'
            disabled={loading}
            onClick={() => {
              setOpen(false);
            }}
          >
            {t('form.cancel')}
          </Button>
          <Button
            disabled={loading}
            onClick={form.handleSubmit(handleSubmit, (errors) => {
              const keys = Object.keys(errors);
              for (const key of keys) {
                const formattedKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                toast.error(`${t(`form.${formattedKey}`)} is ${errors[key]?.message}`);
                return false;
              }
            })}
          >
            {loading && <Icon icon='mdi:loading' className='mr-2 animate-spin' />}{' '}
            {t('form.confirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
