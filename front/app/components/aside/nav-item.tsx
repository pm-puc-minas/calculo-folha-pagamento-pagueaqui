// components/aside/nav-item.tsx
"use client";

import { usePathname } from "next/navigation";
import type { NavItem } from "./nav-config";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { useSidebarContext } from "@/app/context/useSidebarContext";

export function NavItem({ name, href, icon: Icon, partial }: NavItem) {
  const pathname = usePathname();
  const { setSidebarOpen } = useSidebarContext();

  const handleClick = () => {
    if (window.innerWidth < 1280) {
      setSidebarOpen(false);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-center hover:bg-neutral-100 transition-colors duration-500 rounded-md gap-2 px-2 py-2.5 bg-transparent text-[#495057]",
        {
          "text-primary bg-[#F1F0FF] pointer-events-none": partial
            ? pathname.includes(href)
            : pathname === href,
        }
      )}
    >
      <Icon className="size-4" />
      <p className="leading-normal text-[15px] font-medium">{name}</p>
    </Link>
  );
}
