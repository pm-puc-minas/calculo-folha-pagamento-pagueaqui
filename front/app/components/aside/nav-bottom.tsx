'use client';

import { Gear, SignOut } from '@phosphor-icons/react';
import { NavItem } from './nav-item';

export function NavBottom() {
  return (
    <div className="border-t border-border px-3 py-6 space-y-1">
      <div className="block xl:hidden">
        <NavItem href="/auth/login" name="Sair" icon={SignOut} />
      </div>

      <div className="hidden xl:block">
        <NavItem href="/config/company-data" name="Configurações" icon={Gear} />
      </div>
    </div>
  );
}
