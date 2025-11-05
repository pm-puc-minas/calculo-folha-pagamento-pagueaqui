"use client";

import Image from "next/image";
import { NavBottom } from "./nav-bottom";
import { X, User } from "@phosphor-icons/react";
import { useSidebarContext } from "@/app/context/useSidebarContext";
import { useAuth } from "@/app/context/authContext";
import { Nav } from "./nav";

export function Aside() {
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();
  const { user } = useAuth();

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-border flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0 xl:static xl:flex
      `}
    >
      <div
        className={`
          py-6 h-[69px] flex items-center gap-8 px-3 border-b border-border
          ${
            sidebarOpen ? "justify-start" : "justify-between"
          } xl:justify-between
        `}
      >
        {(sidebarOpen === false || typeof window === "undefined") && (
          <div className="flex items-center xl:ml-2">
            <Image
              src="/logo.png"
              alt="PagueAqui Logo"
              width={150}
              height={20}
              className="h-auto w-auto"
            />
          </div>
        )}
        {sidebarOpen && (
          <div className="flex items-center gap-2 xl:hidden">
            <div className="size-8 rounded-full bg-[#F8F9FA] flex items-center justify-center">
              <User className="size-4" />
            </div>
            <div className="text-start font-medium mr-2">
              <p className="text-sm text-[#343A40]">{user?.name}</p>
              <p className="text-xs text-[#868E96]">{user?.role}</p>
            </div>
          </div>
        )}
        <button
          className="xl:hidden ml-auto"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      <Nav />
      <NavBottom />
    </aside>
  );
}
