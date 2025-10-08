"use client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const stringifiedUser = getCookie("user");
    
    if (!stringifiedUser) {
      router.push("/auth/login");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="bg-[#F8F9FA] h-dvh flex gap-4 flex-col items-center justify-center">
      <Image
        src={logo.src}
        alt="PagueAqui Logo"
        width={logo.width}
        height={logo.height}
        className="h-12 object-contain mx-auto"
      />
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-neutral-900 text-lg tracking-tight text-center font-medium">
        Carregando...
      </p>
    </div>
  );
}