import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { LogoImg } from '@/assets/images';
import Background from '@/components/Background/Background';
import LocaleSelect from '@/components/LocaleSelect/LocaleSelect';

type AuthlayoutProps = {
  children: React.ReactNode;
};

const Authlayout = ({ children }: AuthlayoutProps) => {
  return (
    <div className="flex">
      <section className="flex flex-1 flex-col items-center justify-center py-10">
        <div className="absolute right-6 top-6 lg:right-1/2 lg:mr-6">
          <LocaleSelect />
        </div>
        <div className="mt-16 px-4 sm:max-w-lg">
          <Link href="/" className="mb-16 flex justify-center">
            <Image
              className="cursor-pointer transition-all hover:brightness-75 md:scale-125"
              src={LogoImg}
              alt="Blindtus Logo"
              height={40}
              width={(40 * 483) / 102}
            />
          </Link>

          {children}
          <Background withoutImage />
        </div>
      </section>

      <div className="relative hidden h-screen w-1/2 bg-no-repeat object-cover lg:block">
        <Background className="absolute" />
      </div>
    </div>
  );
};

export default Authlayout;
