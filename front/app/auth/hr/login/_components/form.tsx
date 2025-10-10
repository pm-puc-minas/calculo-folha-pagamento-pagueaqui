"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";
import { Envelope, Lock } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as y from "yup";
import { usePublicAuthControllerLogin } from "@/actions/public-auth/public-auth";
import { toast } from "sonner";
import { formatError } from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { UserDto } from "@/app/schemas/model";

const loginSchema = y.object({
  email: y
    .string()
    .email("Por favor, insira um e-mail válido")
    .required("Por favor, insira um e-mail"),
  password: y
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .required("Por favor, insira uma senha"),
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
        setToken(data.data.token || "");
        setUser({
          id: data.data.id,
          email: data.data.email,
          nome: data.data.nome,
        } as UserDto);
        router.push("/dashboard");
        toast.success("Bem vindo de volta!");
      },
      onError(error) {
        if (error && typeof error === 'object' && 'response' in error) {
          toast.error(formatError(error as any));
        } else {
          toast.error("Erro ao fazer login");
        }
      },
    },
  });
  return (
    <form
      onSubmit={methods.handleSubmit((data) =>
        mutate({
          data,
        })
      )}
      className="space-y-4"
    >
      <Input
        methods={methods}
        name="email"
        type="email"
        startContent={<Envelope size={20} />}
        placeholder="Digite seu e-mail"
        label="Login"
        required
      />
      
      <div className="space-y-2">
        <Input
          methods={methods}
          startContent={<Lock size={20} />}
          type="password"
          placeholder="••••••••••••"
          name="password"
          label="Senha"
          required
          endContent={<Lock size={20} />}
        />
        <div className="flex justify-end">
          <Link
            href="/auth/hr/forgot-password"
            className="text-[#343A40] hover:underline text-sm font-medium"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>

      <div className="pt-2">
        <Button 
          className="h-12 font-medium" 
          isLoading={isPending}
        >
          Entrar
        </Button>
      </div>
    </form>
  );
}
