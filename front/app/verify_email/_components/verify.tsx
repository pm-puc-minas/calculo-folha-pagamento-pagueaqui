'use client';

import { Button } from '@/app/components/ui/button';
import { Loader } from '@/app/components/ui/loader';
import api from '@/app/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function Verify() {
  const searchParams = useSearchParams();
  const token = searchParams.get('code');

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('Token is required');
      }
      const response = await api.post('/api/public/auth/verify', {
        code: token,
      });

      return response.data;
    },
  });

  return (
    <main className="w-screen h-screen flex items-center justify-center flex-col gap-4">
      {isLoading && (
        <>
          <Loader className="size-10 text-primary" />
          <p className="text-sm text-muted-foreground">Verificando email...</p>
        </>
      )}
      {isSuccess && (
        <>
          <div className="bg-primary rounded-full p-2">
            <Check className="size-10 text-primary-foreground" />
          </div>
          <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-xl flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground max-w-md text-center">
              Email verificado com sucesso. Utilize o botão abaixo para acessar sua conta.
            </p>
            <Link href="/auth/login">
              <Button>Acessar minha conta</Button>
            </Link>
          </div>
        </>
      )}
      {isError && (
        <>
          <div className="bg-primary rounded-full p-2">
            <X className="size-10 text-primary-foreground" />
          </div>
          <div className="p-2 bg-neutral-100 border border-neutral-200 rounded-xl flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground max-w-md text-center">
              O link de verificação expirou ou é inválido. Por favor, solicite um novo link de
              verificação.
            </p>
            <Link href="/auth/login">
              <Button>Voltar para o login</Button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
