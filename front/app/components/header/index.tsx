// Header.tsx
"use client";
import { Separator } from "../ui/separator";
import { UserHeaderItem } from "./user-item";
import { ShowPathname } from "./pathname";
import { List } from "@phosphor-icons/react";
import { useSidebarContext } from "@/app/context/useSidebarContext";

export function Header() {
  const { setSidebarOpen } = useSidebarContext();

  return (
    <header className="w-full h-[69px] py-[13px] px-7 flex items-center justify-between gap-3.5 bg-white border-b border-border">
      <button className="xl:hidden mr-2" onClick={() => setSidebarOpen(true)}>
        <List size={18} />
      </button>
      <ShowPathname />
      <div className="flex items-center justify-end gap-3 ml-auto">
        <Separator orientation="vertical" className="h-[1.875rem]" />
        <UserHeaderItem />
      </div>
    </header>
  );
}
