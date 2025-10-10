'use client';
import { useAuth } from '@/app/context/authContext';
import logo from '@/public/logo.png';
import { deleteCookie } from 'cookies-next';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignOut() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    deleteCookie('token');
    deleteCookie('user');
    setUser(undefined);
    router.push('/auth/login');
  }, [router, setUser]);

  return (
    <div className="bg-[#F8F9FA] h-dvh flex gap-4 flex-col items-center justify-center">
      <Image
        src={logo.src}
        alt="Autiz Logo"
        width={logo.width}
        height={logo.height}
        className="h-12 object-contain mx-auto"
      />
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-neutral-900 text-lg tracking-tight text-center font-medium">Saindo...</p>
    </div>
  );
}
