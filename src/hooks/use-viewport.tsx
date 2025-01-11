'use client';

import { useEffect, useState } from 'react';

import { breakpoints } from '@/constants/viewport';

const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isXs = viewport.width < breakpoints.sm;
  const isSm = viewport.width >= breakpoints.sm;
  const isMd = viewport.width >= breakpoints.md;
  const isLg = viewport.width >= breakpoints.lg;
  const isXl = viewport.width >= breakpoints.xl;
  const is2Xl = viewport.width >= breakpoints['2xl'];
  const isLessThanSm = viewport.width < breakpoints.sm;
  const isLessThanMd = viewport.width < breakpoints.md;

  return {
    ...viewport,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isLessThanSm,
    isLessThanMd,
  };
};

export default useViewport;
