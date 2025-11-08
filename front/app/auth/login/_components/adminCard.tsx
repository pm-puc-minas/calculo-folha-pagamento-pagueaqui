"use client";

import { GraphIcon } from "@phosphor-icons/react";

export default function AdminCard() {
  return (
    <div className="flex items-center h-24 gap-4 rounded-lg border-1 border-[#1B1D1C0D] p-6 hover:bg-[#4000FE08]">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4000FE08]">
        <GraphIcon
          weight="duotone"
          className="text-[#4000FE]"
          height={24}
          width={24}
        />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-[16px] font-medium">Sou da Equipe Administrativa</h2>
        <p className="text-sm text-[#1B1D1CCC] leading-[140%]">
          Gerencie folhas de pagamento, <br /> funcionários e relatórios com facilidade
        </p>
      </div>
    </div>
  );
}
