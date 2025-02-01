'use client';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

const SuggestLink = ({ className = '' }: Props) => {
  const __ = useTranslations();

  return (
    <Button asChild size="sm" className={cn(className)}>
      <Link href="/suggest">{__('!noun:suggest')}</Link>
    </Button>
  );
};

export default SuggestLink;
