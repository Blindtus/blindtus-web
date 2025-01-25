'use client';

import { useMemo, useState } from 'react';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { HelpCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import TodayBlindtusRules from '@/components/Modal/TodayBlindtusRules';
import TodayCastusRules from '@/components/Modal/TodayCastusRules';
import TodayHotDateRules from '@/components/Modal/TodayHotDateRules';
import TodayPixelusRules from '@/components/Modal/TodayPixelusRules';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import TodayTitleTwistRules from '../Modal/TodayTitleTwistRules';

type Props = {
  type: 'blindtus' | 'pixelus' | 'castus' | 'hotDate' | 'titleTwist';
  className?: string;
};

const TodayGameRules = ({ className, type }: Props) => {
  const [open, setOpen] = useState(false);
  const __ = useTranslations();

  const modalContent = useMemo(() => {
    switch (type) {
      case 'blindtus':
        return <TodayBlindtusRules />;
      case 'pixelus':
        return <TodayPixelusRules />;
      case 'castus':
        return <TodayCastusRules />;
      case 'hotDate':
        return <TodayHotDateRules />;
      case 'titleTwist':
        return <TodayTitleTwistRules />;
      default:
        return null;
    }
  }, [type]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(className)} asChild>
        <Button variant="secondary">
          <HelpCircleIcon />
          {__('!noun:rules')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2em)]">
        <DialogHeader className="mt-8">{modalContent}</DialogHeader>
        <DialogFooter className="mt-4">
          <Button onClick={() => setOpen(false)}>{__('!noun:got-it')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TodayGameRules;
