'use client';

import { useCallback, useEffect, useState } from 'react';

import { Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Locale } from '@/i18n/config';
import { setUserLocale } from '@/i18n/locale';
import { getCurrentLocale } from '@/utils/i18nUtils';

import Loader from '../Loader';

const LocaleSelect = () => {
  const [currentLocale, setCurrentLocale] = useState<Locale | null>(null);

  useEffect(() => {
    const locale = getCurrentLocale();
    setCurrentLocale(locale as Locale);
  }, []);

  const handleChangeLocale = useCallback((locale: string) => {
    setUserLocale(locale as Locale);
    setCurrentLocale(locale as Locale);
  }, []);

  if (!currentLocale) {
    return (
      <Button variant="secondary">
        <Globe size={16} className="mr-2" /> <Loader size="small" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Globe size={16} />{' '}
          <span className="ml-2 hidden md:block">
            {currentLocale === 'fr' ? 'Français' : 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={currentLocale} onValueChange={handleChangeLocale}>
          <DropdownMenuRadioItem value="en" className="cursor-pointer">
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fr" className="cursor-pointer">
            Français
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSelect;
