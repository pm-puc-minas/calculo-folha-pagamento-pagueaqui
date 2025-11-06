"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Shield, Languages } from "lucide-react";
import { cn } from "@/app/lib/utils";

type ConfigLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const links: ConfigLink[] = [
  { href: "/main/config/security", label: "Segurança", icon: Shield },
  { href: "/main/config/notification", label: "Notificações", icon: Bell },
  { href: "/main/config/language", label: "Idioma", icon: Languages },
];

export function ConfigAside() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-white hidden xl:flex flex-col">
      <div className="px-4 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-gray-700">Configurações</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-2 py-2.5 rounded-md text-[#495057] hover:bg-neutral-100 transition-colors",
              {
                "text-primary bg-[#F1F0FF] pointer-events-none": pathname === href,
              },
            )}
          >
            <Icon className="size-4" />
            <span className="text-[15px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default ConfigAside;
