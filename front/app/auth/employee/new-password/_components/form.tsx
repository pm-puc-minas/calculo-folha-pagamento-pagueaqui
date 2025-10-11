"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as y from "yup";
import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatError, api } from "@/app/lib/axios";
import { useMutation } from "@tanstack/react-query";

const newPasswordSchema = y.object({
  password: y
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .required("Por favor, insira uma senha"),
  confirmPassword: y
    .string()
    .oneOf([y.ref("password")], "As senhas devem ser iguais")
    .required("Por favor, insira uma senha"),
});

type NewPasswordFormProps = y.InferType<typeof newPasswordSchema>;

const newPasswordRequest = async (data: { newPassword: string; token: string }) => {
  const response = await api.post('/auth/new-password', data);
  return response.data;
};

export function NewPasswordForm({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const router = useRouter();
  const { token } = use(searchParams);
  const methods = useForm<NewPasswordFormProps>({
    resolver: yupResolver(newPasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { newPassword: string }) => newPasswordRequest({
      newPassword: data.newPassword,
      token: token as string,
    }),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso");
      router.push("/auth/employee/login");
    },
    onError: (error: any) => {
      toast.error(formatError(error));
    },
  });

  return (
    <>
      <form
        onSubmit={methods.handleSubmit((data) =>
          mutate({
            newPassword: data.password,
          })
        )}
        className="space-y-6"
      >
        <Input
          name="password"
          type="password"
          methods={methods}
          required
          label="Senha"
          placeholder="********"
          disabled={isPending}
        />
        <Input
          name="confirmPassword"
          methods={methods}
          required
          label="Confirme sua senha"
          type="password"
          placeholder="********"
          disabled={isPending}
        />
        <Button isLoading={isPending}>Salvar nova senha</Button>
      </form>
    </>
  );
}
