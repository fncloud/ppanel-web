'use client';

import { getPrivacyPolicyConfig, updatePrivacyPolicyConfig } from '@/services/admin/system';
import { useQuery } from '@tanstack/react-query';
import { MarkdownEditor } from '@workspace/ui/custom-components/editor';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function PrivacyPolicy() {
  const t = useTranslations('system.privacy-policy');
  const { data, refetch, isFetched } = useQuery({
    queryKey: ['getPrivacyPolicyConfig'],
    queryFn: async () => {
      const { data } = await getPrivacyPolicyConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updatePrivacyPolicyConfig({
        ...data,
        [key]: value,
      } as API.PrivacyPolicyConfig);
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
          value={data?.privacy_policy}
          onBlur={(value) => {
            if (data?.privacy_policy !== value) {
              updateConfig('privacy_policy', value);
            }
          }}
        />
      </div>
    )
  );
}
