'use client';

import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import useViewport from '@/hooks/use-viewport';
import { cn } from '@/lib/utils';

interface BaseProps {
  children: React.ReactNode;
}

interface RootCredenzaProps extends BaseProps {
  open?: boolean;
}

interface CredenzaProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const Credenza = ({ children, ...props }: RootCredenzaProps) => {
  const { isMd } = useViewport();
  const Credenza = isMd ? Dialog : Drawer;

  return <Credenza {...props}>{children}</Credenza>;
};

const CredenzaTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const { isMd } = useViewport();
  const CredenzaTrigger = isMd ? DialogTrigger : DrawerTrigger;

  return (
    <CredenzaTrigger className={className} {...props}>
      {children}
    </CredenzaTrigger>
  );
};

const CredenzaClose = ({ className, children, ...props }: CredenzaProps) => {
  const { isMd } = useViewport();
  const CredenzaClose = isMd ? DialogClose : DrawerClose;

  return (
    <CredenzaClose className={className} {...props}>
      {children}
    </CredenzaClose>
  );
};

const CredenzaContent = ({ className, children, ...props }: CredenzaProps) => {
  const { isMd } = useViewport();
  const CredenzaContent = isMd ? DialogContent : DrawerContent;

  return (
    <CredenzaContent className={className} {...props}>
      {children}
    </CredenzaContent>
  );
};

const CredenzaDescription = ({ className, children, ...props }: CredenzaProps) => {
  const { isMd } = useViewport();
  const CredenzaDescription = isMd ? DialogDescription : DrawerDescription;

  return (
    <CredenzaDescription className={className} {...props}>
      {children}
    </CredenzaDescription>
  );
};

const CredenzaHeader = ({ className, children, ...props }: CredenzaProps) => {
  const { isMd } = useViewport();
  const CredenzaHeader = isMd ? DialogHeader : DrawerHeader;

  return (
    <CredenzaHeader className={className} {...props}>
      {children}
    </CredenzaHeader>
  );
};

const CredenzaTitle = ({ className, children, ...props }: CredenzaProps) => {
  const { isMd } = useViewport();
  const CredenzaTitle = isMd ? DialogTitle : DrawerTitle;

  return (
    <CredenzaTitle className={className} {...props}>
      {children}
    </CredenzaTitle>
  );
};

const CredenzaBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className={cn('px-4 md:px-0', className)} {...props}>
      <div className="block max-h-[70vh] overflow-y-auto">{children}</div>
    </div>
  );
};

const CredenzaFooter = ({ className, children, ...props }: CredenzaProps) => {
  const { isMd } = useViewport();
  const CredenzaFooter = isMd ? DialogFooter : DrawerFooter;

  return (
    <CredenzaFooter className={className} {...props}>
      {children}
    </CredenzaFooter>
  );
};

export {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
};
