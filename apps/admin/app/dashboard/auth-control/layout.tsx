'use client';

import { AuthControl } from '@/config/navs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AuthControlLayoutProps {
  children: React.ReactNode;
}

export default function AuthControlLayout({ children }: Readonly<AuthControlLayoutProps>) {
  const pathname = usePathname();
  const t = useTranslations('menu');
  if (!pathname) return null;
  return (
    <Tabs value={pathname}>
      <TabsList className='h-full flex-wrap'>
        {AuthControl.map((item) => (
          <TabsTrigger key={item.url} value={item.url} asChild>
            <Link href={item.url}>{t(item.title)}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={pathname}>{children}</TabsContent>
    </Tabs>
  );
}
