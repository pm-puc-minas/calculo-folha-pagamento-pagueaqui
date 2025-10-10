"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as y from "yup";
import { Envelope } from "@phosphor-icons/react";
import { usePublicAuthControllerForgotPassword } from "@/actions/public-auth/public-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const forgotPasswordSchema = y.object({
  email: y
    .string()
    .email("Insira um e-mail válido.")
    .required("E-mail obrigatório"),
});

type ForgotPasswordFormProps = y.InferType<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const methods = useForm<ForgotPasswordFormProps>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = usePublicAuthControllerForgotPassword({
    mutation: {
      onSuccess: () => {
        toast.success("E-mail enviado com sucesso");
        router.push("/auth/new-password");
      },
      onError(error) {
        const errorMessage = (error as any)?.message || "Não foi possível enviar o e-mail";
        toast.error(errorMessage);
      },
    },
  });
  return (
    <>
      <form
        onSubmit={methods.handleSubmit((data) =>
          mutate({
            data: {
              email: data.email,
            },
          })
        )}
        className="space-y-6"
      >
        <Input
          name="email"
          methods={methods}
          required
          label="E-mail"
          type="email"
          endContent={<Envelope />}
          placeholder="m.zuck@meta.com"
          disabled={isPending}
        />
        <Button isLoading={isPending}>Recuperar senha</Button>
      </form>
    </>
  );
}
