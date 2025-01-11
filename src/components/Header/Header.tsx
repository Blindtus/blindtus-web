'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';

import { LogoImg } from '@/assets/images';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';

import LocaleSelect from '../LocaleSelect';

const Header = () => {
  const { isAdmin, logout } = useUserContext();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const renderActions = useMemo(() => {
    if (isAdmin) {
      return (
        <>
          <Button asChild size="sm">
            <Link href="/admin">Admin</Link>
          </Button>
          <Button size="sm" variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </>
      );
    }

    return null;
  }, [handleLogout, isAdmin]);

  return (
    <header className="header">
      <div className="header__container px-4 md:px-8">
        <div>
          <Link href="/">
            <Image
              className="cursor-pointer transition-all hover:brightness-75 md:scale-125"
              src={LogoImg}
              alt="Blindtus Logo"
              height={24}
              width={(24 * 483) / 102}
            />
          </Link>
        </div>
        <div className="flex h-12 items-center justify-center gap-2">
          <LocaleSelect />
          {renderActions}
        </div>
      </div>
    </header>
  );
};

export default Header;
