"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as y from "yup";
import { toast } from "sonner";
import { formatError, api } from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { AuthUserDto } from "@/app/schemas/model";
import { useMutation } from "@tanstack/react-query";

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

const loginRequest = async (data: LoginFormProps) => {
  const response = await api.post('/auth/login', { ...data, accountType: 'HR' });
  return response.data;
};

export function LoginForm() {
  const router = useRouter();
  const methods = useForm<LoginFormProps>({
    resolver: yupResolver(loginSchema),
  });

  const { setToken, setUser } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormProps) => loginRequest(data),
    onSuccess: (response: any) => {
      setToken(response.accessToken);
      setUser(response.user as AuthUserDto);
      router.push("/dashboard");
      toast.success("Bem vindo de volta!");
    },
    onError: (error: any) => {
      toast.error(formatError(error));
    },
  });
  return (
    <>
      <form
        onSubmit={methods.handleSubmit((data) =>
          mutate(data)
        )}
        className="space-y-6"
      >
        <Input
          methods={methods}
          name="email"
          type="email"
          placeholder="Digite seu e-mail"
          label="Login"
          required
        />
        <Input
          methods={methods}
          type="password"
          placeholder="********"
          name="password"
          label="Senha"
          required
          customMessageClass="flex items-center justify-end"
          customMessage={
            <Link
              href="/auth/hr/forgot-password"
              className="text-[#343A40] hover:underline text-sm font-medium"
            >
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
