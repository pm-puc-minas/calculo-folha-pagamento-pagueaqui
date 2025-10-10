'use client';
import { usePublicAuthControllerLogin } from '@/actions/public-auth/public-auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useAuth } from '@/app/context/authContext';
import { formatError } from '@/app/lib/axios';
import { UserDto } from '@/app/schemas/model';
import { yupResolver } from '@hookform/resolvers/yup';
import { Envelope, Lock } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as y from 'yup';

const loginSchema = y.object({
  email: y
    .string()
    .email('Por favor, insira um e-mail válido')
    .required('Por favor, insira um e-mail'),
  password: y
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .required('Por favor, insira uma senha'),
});

type LoginFormProps = y.InferType<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const methods = useForm<LoginFormProps>({
    resolver: yupResolver(loginSchema),
  });

  const { setToken, setUser } = useAuth();

  const { mutate, isPending } = usePublicAuthControllerLogin({
    mutation: {
      onSuccess: (data) => {
        // 'data' here is AxiosResponse<PublicAuthControllerLogin200>
        setToken(data.data.token || '');
        setUser(
          {
            id: data.data.id,
            email: data.data.email,
            nome: data.data.nome,
          } as UserDto,
        );
        router.push('/dashboard');
        toast.success('Bem vindo de volta!');
      },
      onError(error) {
        // Ensure we pass an AxiosError to formatError when available
        if (error && typeof error === 'object' && 'response' in error) {
          toast.error(formatError(error as any));
        } else {
          toast.error('Erro ao fazer login');
        }
      },
    },
  });
  return (
    <>
      <form
        onSubmit={methods.handleSubmit((data) =>
          mutate({
            data,
          }),
        )}
        className="space-y-6">
        <Input
          methods={methods}
          name="email"
          type="email"
          startContent={<Envelope />}
          placeholder="Digite seu e-mail"
          label="Login"
          required
        />
        <Input
          methods={methods}
          startContent={<Lock />}
          type="password"
          placeholder="********"
          name="password"
          label="Senha"
          required
          customMessageClass="flex items-center justify-end"
          customMessage={
            <Link
              href="/auth/employee/forgot-password"
              className="text-[#343A40] hover:underline text-sm font-medium">
              Esqueci minha senha
            </Link>
          }
        />
        <Button className="h-12" isLoading={isPending}>
          Entrar
        </Button>
      </form>
    </>
  );
}
