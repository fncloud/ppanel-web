'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Progress } from '@workspace/ui/components/progress';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { formatDate } from '@workspace/ui/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { UserSubscribeDetail } from '../user/user-detail';

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function NodeStatusCell({ status }: { status: API.NodeStatus }) {
  const t = useTranslations('server.node');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const { online, cpu, mem, disk, updated_at } = status || {
    online: {},
    cpu: 0,
    mem: 0,
    disk: 0,
    updated_at: 0,
  };
  const isOnline = updated_at > 0;
  const badgeVariant = isOnline ? 'default' : 'destructive';
  const badgeText = isOnline ? t('normal') : t('abnormal');
  const onlineCount = (online && Object.keys(online).length) || 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='flex items-center gap-2 text-xs *:flex-1'>
            <div className='flex items-center space-x-1'>
              <Badge variant={badgeVariant}>{badgeText}</Badge>
              <span className='font-medium'>
                {t('onlineCount')}: {onlineCount}
              </span>
            </div>
            <div className='flex flex-col space-y-1'>
              <div className='flex justify-between'>
                <span>CPU</span>
                <span>{formatPercentage(cpu ?? 0)}</span>
              </div>
              <Progress value={cpu ?? 0} className='h-2' max={100} />
            </div>
            <div className='flex flex-col space-y-1'>
              <div className='flex justify-between'>
                <span>{t('memory')}</span>
                <span>{formatPercentage(mem ?? 0)}</span>
              </div>
              <Progress value={mem ?? 0} className='h-2' max={100} />
            </div>
            <div className='flex flex-col space-y-1'>
              <div className='flex justify-between'>
                <span>{t('disk')}</span>
                <span>{formatPercentage(disk ?? 0)}</span>
              </div>
              <Progress value={disk ?? 0} className='h-2' max={100} />
            </div>
            {isOnline && (
              <div>
                {t('lastUpdated')}: {formatDate(updated_at ?? 0)}
              </div>
            )}
          </div>
        </TooltipTrigger>
        {isOnline && onlineCount > 0 && (
          <TooltipContent className='bg-card text-foreground w-96'>
            <ScrollArea className='h-[540px] rounded-md border px-4 py-2'>
              <h4 className='py-1 text-sm font-semibold'>{t('onlineUsers')}</h4>
              <Accordion
                type='single'
                collapsible
                className='w-full'
                onValueChange={(value) => setOpenItem(value)}
              >
                {Object.entries(online).map(([uid, ips]) => (
                  <AccordionItem key={uid} value={uid}>
                    <AccordionTrigger>{`[UID: ${uid}] - ${ips[0]}`}</AccordionTrigger>
                    <AccordionContent>
                      <ul>
                        {ips.map((ip: string) => (
                          <li key={ip}>{ip}</li>
                        ))}
                      </ul>
                      <UserSubscribeDetail id={Number(uid)} enabled={openItem === uid} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
