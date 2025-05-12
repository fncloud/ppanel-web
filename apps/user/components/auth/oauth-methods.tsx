'use client';

import useGlobalStore from '@/config/use-global';
import { oAuthLogin } from '@/services/common/oauth';
import { Button } from '@workspace/ui/components/button';
import { Icon } from '@workspace/ui/custom-components/icon';

const icons = {
  apple: 'uil:apple',
  google: 'logos:google-icon',
  facebook: 'logos:facebook',
  github: 'uil:github',
  telegram: 'logos:telegram',
};

export function OAuthMethods() {
  const { common } = useGlobalStore();
  const { oauth_methods } = common;
  const OAUTH_METHODS = oauth_methods?.filter(
    (method) => !['mobile', 'email', 'device'].includes(method),
  );
  return (
    OAUTH_METHODS?.length > 0 && (
      <>
        <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
          <span className='bg-background text-muted-foreground relative z-10 px-2'>
            Or continue with
          </span>
        </div>
        <div className='mt-6 flex justify-center gap-4 *:size-12 *:p-2'>
          {OAUTH_METHODS?.map((method: any) => {
            return (
              <Button
                key={method}
                variant='ghost'
                size='icon'
                asChild
                onClick={async () => {
                  const { data } = await oAuthLogin({
                    method,
                    redirect: `${window.location.origin}/oauth/${method}`,
                  });
                  if (data.data?.redirect) {
                    window.location.href = data.data?.redirect;
                  }
                }}
              >
                <Icon icon={icons[method as keyof typeof icons]} />
              </Button>
            );
          })}
        </div>
      </>
    )
  );
}
