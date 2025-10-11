"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as y from "yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatError, api } from "@/app/lib/axios";
import { useMutation } from "@tanstack/react-query";

const forgotPasswordSchema = y.object({
  email: y
    .string()
    .email("Insira um e-mail válido.")
    .required("E-mail obrigatório"),
});

type ForgotPasswordFormProps = y.InferType<typeof forgotPasswordSchema>;

const forgotPasswordRequest = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email, accountType: 'EMPLOYEE' });
  return response.data;
};

export function ForgotPasswordForm() {
  const router = useRouter();
  const methods = useForm<ForgotPasswordFormProps>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) => forgotPasswordRequest(email),
    onSuccess: (_, variables) => {
      toast.success("E-mail enviado com sucesso");
      router.push(`/auth/employee/verify?email=${variables}`);
    },
    onError: (error: any) => {
      toast.error(formatError(error, "Não foi possível enviar o e-mail"));
    },
  });
  return (
    <>
      <form
        onSubmit={methods.handleSubmit((data) => mutate(data.email))}
        className="space-y-6"
      >
        <Input
          name="email"
          methods={methods}
          required
          label="E-mail"
          type="email"
          placeholder="m.zuck@meta.com"
          disabled={isPending}
        />
        <Button isLoading={isPending}>Recuperar senha</Button>
      </form>
    </>
  );
}
