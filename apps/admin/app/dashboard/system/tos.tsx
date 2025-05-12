'use client';

import { getTosConfig, updateTosConfig } from '@/services/admin/system';
import { useQuery } from '@tanstack/react-query';
import { MarkdownEditor } from '@workspace/ui/custom-components/editor';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function Tos() {
  const t = useTranslations('system.tos');
  const { data, refetch, isFetched } = useQuery({
    queryKey: ['getTosConfig'],
    queryFn: async () => {
      const { data } = await getTosConfig();

      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateTosConfig({
        ...data,
        [key]: value,
      } as API.TosConfig);
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {
      /* empty */
    }
  }

  return (
    isFetched && (
      <div className='h-[calc(100dvh-132px-env(safe-area-inset-top))] overflow-hidden'>
        <MarkdownEditor
          title={t('title')}
          value={data?.tos_content}
          onBlur={(value) => {
            if (data?.tos_content !== value) {
              updateConfig('tos_content', value);
            }
          }}
        />
      </div>
    )
  );
}
