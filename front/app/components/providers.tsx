"use client";

import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./ui/sonner";
import { AuthProvider } from "@/app/context/authContext";
import { SidebarProvider } from "@/app/context/useSidebarContext";

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
