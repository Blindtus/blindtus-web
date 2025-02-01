import {
  CalendarIcon,
  LayoutDashboardIcon,
  ListIcon,
  type LucideIcon,
  MapIcon,
  MusicIcon,
  SettingsIcon,
} from 'lucide-react';

import type { Category } from '@/types/category.type';

export type Submenu = {
  href: string;
  label: string;
  icon?: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export const getMenuList = (pathname: string, categories: Category[] | undefined): Group[] => {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/admin',
          label: 'Dashboard',
          active: pathname.endsWith('/admin'),
          icon: LayoutDashboardIcon,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Games',
      menus: [
        {
          href: '/admin/games/today',
          label: 'Today',
          active: pathname.includes('/today'),
          icon: CalendarIcon,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Medias',
      menus: [
        {
          href: '/admin/medias/types',
          label: 'Media types',
          active: pathname.includes('/types'),
          icon: ListIcon,
          submenus: [],
        },
        {
          href: '',
          label: 'Categories',
          active: pathname.includes('/medias') && !pathname.includes('/types'),
          icon: ListIcon,
          submenus:
            categories?.map(({ label, slug }) => ({
              href: `/admin/medias/${slug}`,
              label,
              active: pathname.includes(`/medias/${slug}`),
            })) ?? [],
        },
      ],
    },
    {
      groupLabel: '',
      menus: [
        {
          href: '/admin/musics',
          label: 'Musics',
          active: pathname.includes('/musics'),
          icon: MusicIcon,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: '',
      menus: [
        {
          href: '/admin/roadmap',
          label: 'Roadmap',
          active: pathname.includes('/roadmap'),
          icon: MapIcon,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: '',
      menus: [
        {
          href: '/admin/settings',
          label: 'Settings',
          active: pathname.includes('/settings'),
          icon: SettingsIcon,
          submenus: [],
        },
      ],
    },
  ];
};
