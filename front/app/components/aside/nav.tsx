"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  navConfig,
} from "./nav-config";
import { NavItem } from "./nav-item";

export function Nav() {
  return (
    <nav className="flex-1 overflow-y-auto px-3 space-y-1 mt-2">
      {navConfig.map((navItem) => (
        <NavItem key={navItem.href} {...navItem} />
      ))}
    </nav>
  );
}
