
import { Loader } from '@/app/components/ui/loader';
import { Suspense } from 'react';
import { Verify } from './_components/verify';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="w-screen h-screen flex items-center justify-center flex-col gap-4">
          <Loader className="size-10 text-primary" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </main>
      }>
      <Verify />
    </Suspense>
  );
}
