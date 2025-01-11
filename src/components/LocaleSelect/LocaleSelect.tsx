'use client';

import { useCallback } from 'react';

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

const LocaleSelect = () => {
  const currentLocale = getCurrentLocale();

  const handleChangeLocale = useCallback((locale: string) => {
    setUserLocale(locale as Locale);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Globe size={16} className="mr-2" /> {currentLocale === 'fr' ? 'Français' : 'English'}
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
