"use client";

import { PageTitle } from "@/app/components/ui/page-title";
import { useAuth } from "@/app/context/authContext";
import { formatDate } from "@/app/lib/utils";

export function DashboardHeader() {
  const { user } = useAuth();
  return (
    <PageTitle
      title={`Olá, ${user?.name?.split(" ")?.[0] || "Usuário"}! 👋`}
      classNames={{
        mainWrapperClass: "mb-2",
      }}
    />
  );
}
