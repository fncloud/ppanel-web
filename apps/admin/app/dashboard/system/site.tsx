'use client';

import { getSiteConfig, updateSiteConfig } from '@/services/admin/system';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@workspace/ui/components/label';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import { Textarea } from '@workspace/ui/components/textarea';
import { JSONEditor } from '@workspace/ui/custom-components/editor';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { UploadImage } from '@workspace/ui/custom-components/upload-image';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Site() {
  const t = useTranslations('system.site');
  const ref = useRef<API.SiteConfig | undefined>(undefined);
  const { data, refetch } = useQuery({
    queryKey: ['getSiteConfig'],
    queryFn: async () => {
      const { data } = await getSiteConfig();
      ref.current = data.data;
      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateSiteConfig({
        ...ref.current,
        [key]: value,
      } as API.SiteConfig);
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
            <Label>{t('logo')}</Label>
            <p className='text-muted-foreground text-xs'>{t('logoDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('logoPlaceholder')}
              value={data?.site_logo}
              onValueBlur={(value) => updateConfig('site_logo', value)}
              suffix={
                <UploadImage
                  className='bg-muted h-9 rounded-none border-none px-2'
                  onChange={(value) => {
                    updateConfig('site_logo', value);
                  }}
                />
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('siteName')}</Label>
            <p className='text-muted-foreground text-xs'>{t('siteNameDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('siteNamePlaceholder')}
              value={data?.site_name}
              onValueBlur={(value) => updateConfig('site_name', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('siteDesc')}</Label>
            <p className='text-muted-foreground text-xs'>{t('siteDescDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('siteDescPlaceholder')}
              value={data?.site_desc}
              onValueBlur={(value) => updateConfig('site_desc', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('keywords')}</Label>
            <p className='text-muted-foreground text-xs'>{t('keywordsDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('keywordsDescription')}
              value={data?.keywords}
              onValueBlur={(value) => updateConfig('keywords', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='align-top'>
            <Label>{t('customHtml')}</Label>
            <p className='text-muted-foreground text-xs'>{t('customHtmlDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Textarea
              className='h-52'
              placeholder={t('customHtmlDescription')}
              defaultValue={data?.custom_html}
              onBlur={(e) => {
                updateConfig('custom_html', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='align-top'>
            <Label>{t('siteDomain')}</Label>
            <p className='text-muted-foreground text-xs'>{t('siteDomainDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Textarea
              className='h-52'
              placeholder={`${t('siteDomainPlaceholder')}\nexample.com\nwww.example.com`}
              defaultValue={data?.host}
              onBlur={(e) => {
                updateConfig('host', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('customData')}</Label>
            <p className='text-muted-foreground text-xs'>{t('customDataDescription')}</p>
          </TableCell>
          <TableCell className='w-1/2 text-right'>
            <JSONEditor
              schema={{
                type: 'object',
                additionalProperties: true,
                properties: {
                  website: { type: 'string', title: 'Website' },
                  contacts: {
                    type: 'object',
                    title: 'Contacts',
                    additionalProperties: true,
                    properties: {
                      email: { type: 'string', title: 'Email' },
                      telephone: { type: 'string', title: 'Telephone' },
                      address: { type: 'string', title: 'Address' },
                    },
                  },
                  community: {
                    type: 'object',
                    title: 'Community',
                    additionalProperties: true,
                    properties: {
                      telegram: { type: 'string', title: 'Telegram' },
                      twitter: { type: 'string', title: 'Twitter' },
                      discord: { type: 'string', title: 'Discord' },
                      instagram: { type: 'string', title: 'Instagram' },
                      linkedin: { type: 'string', title: 'Linkedin' },
                      facebook: { type: 'string', title: 'Facebook' },
                      github: { type: 'string', title: 'Github' },
                    },
                  },
                },
              }}
              value={data?.custom_data}
              onBlur={(value) => updateConfig('custom_data', value)}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
