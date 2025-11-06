"use client";

import { Aside } from "@/app/components/aside";
import { Header } from "@/app/components/header";
import { EmployeeRegistrationProvider } from "@/app/context/employeeRegistrationContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmployeeRegistrationProvider>
      <div className="flex h-screen w-full">
        <Aside />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </EmployeeRegistrationProvider>
  );
}
