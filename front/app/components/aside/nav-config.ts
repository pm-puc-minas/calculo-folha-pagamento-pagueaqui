'use client';

import { BriefcaseIcon, CalendarBlankIcon, DesktopIcon, FilesIcon, UsersIcon } from '@phosphor-icons/react';
import { HouseIcon } from 'lucide-react';
import { ElementType } from 'react';

export type NavItem = {
  name: string;
  href: string;
  icon: ElementType;
  subItens?: Omit<NavItem, 'icon'>[];
  hidden?: boolean;
  partial?: boolean;
  showingName?: string;
};

export const navConfig: NavItem[] = [
  {
    name: 'Início',
    href: '/main/dashboard',
    icon: HouseIcon,
    showingName: 'Dashboard',
  },
  {
    name: 'Agenda',
    href: '/main/schedule',
    icon: CalendarBlankIcon,
    showingName: 'Agenda',
  },
  {
    name: 'Colaboradores',
    href: '/main/employees',
    icon: UsersIcon,
    showingName: 'Colaboradores',
    partial: true,
  },
  {
    name: 'Departamentos',
    href: '/main/departments',
    icon: BriefcaseIcon,
    showingName: 'Departamentos',
  },
  {
    name: 'Cargos',
    href: '/main/positions',
    icon: DesktopIcon,
    showingName: 'Cargos',
  },
  {
    name: 'Folha de Pagamento',
    href: '/main/payroll',
    icon: FilesIcon,
    showingName: 'Folha de Pagamento',
  },
];

export function getShowingName(href: string) {
  const navItem =
    navConfig.find((item) => href.includes(item.href))

  if (!navItem && href.includes('/config')) {
    return 'Configurações';
  }
  if (navItem && (navItem.href === href || navItem.partial)) {
    return navItem.showingName;
  }

  if (href === '/myProfile') {
    return 'Meu Perfil';
  }
  return '';
}
