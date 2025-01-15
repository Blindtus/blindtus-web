import Link from 'next/link';

import { useTranslations } from 'next-intl';

const Footer = () => {
  const __ = useTranslations();

  return (
    <footer className="container my-16 flex flex-col items-start justify-between gap-2 xs:flex-row xs:items-center">
      <div className="flex flex-col gap-2 xs:flex-row">
        <Link className="hover:underline" href="/terms">
          {__('!noun:terms')}
        </Link>
        <Link className="hover:underline" href="/privacy">
          {__('!noun:privacy')}
        </Link>
      </div>
      <div className="flex gap-2">
        <div>
          <Link className="hover:underline" href="https://x.com/Cl3tus_" target="_blank">
            @Cl3tus_
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
