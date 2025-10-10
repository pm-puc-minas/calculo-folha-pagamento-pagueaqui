"use client";
import { Suspense } from "react";
import {
  usePublicAuthControllerSendVerificationCode,
  usePublicAuthControllerVerify,
} from "@/actions/public-auth/public-auth";
import { Button, buttonVariants } from "@/app/components/ui/button";
import { useCountdown } from "@/app/hook/useCountdown";
import { formatError } from "@/app/lib/axios";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/ui/input-otp";
import { useState } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type {
  BadRequestGenericResponseDto,
  UnauthorizedGenericResponseDto,
  ForbiddenGenericResponseDto,
  NotFoundGenericResponseDto,
} from "@/app/schemas/model";
import type { AxiosError } from "axios";

function VerifyTokenInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { setToken, setUser } = useAuth();
  const [code, setCode] = useState<string>("");
  const {
    mutate: sendNewCode,
    isSuccess,
    isPending,
  } = usePublicAuthControllerSendVerificationCode<
    AxiosError<
      | BadRequestGenericResponseDto
      | UnauthorizedGenericResponseDto
      | ForbiddenGenericResponseDto
      | NotFoundGenericResponseDto
    >
  >({
    mutation: {
      onSuccess: () => {
        startCountdown();
      },
      onError(error) {
        toast.error(
          formatError(
            error,
            "Erro ao reenviar código. Tente novamente mais tarde."
          )
        );
      },
    },
  });

  const {
    isError,
    mutate,
    isSuccess: isVerified,
    isPending: isVerifying,
  } = usePublicAuthControllerVerify<
    AxiosError<
      | BadRequestGenericResponseDto
      | UnauthorizedGenericResponseDto
      | ForbiddenGenericResponseDto
      | NotFoundGenericResponseDto
    >
  >({
    mutation: {
      onSuccess() {
        // E-mail verificado com sucesso; exibiremos a UI de sucesso abaixo.
      },
      onError(error) {
        if (error.response?.status === 500) {
          toast.error(
            formatError(
              error,
              "Erro ao verificar e-mail. Tente novamente mais tarde."
            )
          );
        }
      },
    },
  });

  const [count, { startCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  });

  if (isVerified) {
    return (
      <>
        <div className="space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-[#343A40] text-xl text-balance font-semibold">
              E-mail verificado! 🚀
            </h2>
            <p className="text-[#909296] text-balance text-sm font-medium">
              Seja bem vindo a Autiz, clique no botão <br /> abaixo para acessar
              a plataforma.
            </p>
          </div>

          <Link
            href="/dashboard"
            className={buttonVariants({ className: "max-w-[300px]" })}
          >
            Acessar a Autiz
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex space-y-6 text-center items-center flex-col">
        <Image
          src="/logo.png"
          alt="Logo PagueAqui"
          width={200}
          height={33}
          className="xl:hidden"
        />
        <div className="space-y-2">
          <h2 className="text-[#343A40] text-xl text-balance font-semibold">
            Verificação de e-mail enviada
          </h2>
          <p className="text-[#909296] text-balance text-sm font-medium">
            Para continuar, insira o código de 6 dígitos que <br /> enviamos
            para o seu e-mail.
          </p>
        </div>

        <InputOTP
          containerClassName="justify-center"
          value={code}
          onChange={(e) => {
            if (e.length === 6) {
              mutate({ data: { email, verificationCode: e } });
            }
            setCode(e);
          }}
          maxLength={6}
          disabled={isVerifying}
        >
          <InputOTPGroup>
            <InputOTPSlot isError={isError} index={0} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot isError={isError} index={1} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot isError={isError} index={2} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot isError={isError} index={3} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot isError={isError} index={4} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot isError={isError} index={5} />
          </InputOTPGroup>
        </InputOTP>
        {isError && (
          <p className="bg-[#FFF5F5] w-fit mx-auto rounded-md text-[#E03131] text-center text-xs font-medium p-1.5">
            <span>
              <WarningCircle className="size-3.5 inline-flex" />
            </span>{" "}
            Código inválido. Tente novamente ou gere um novo.
          </p>
        )}
        <Button
          isLoading={isPending}
          disabled={isSuccess && count > 0}
          onClick={() =>
            sendNewCode({ data: { email } })
          }
        >
          Enviar novo código {isSuccess && count > 0 && <>({count}s)</>}
        </Button>
      </div>
    </>
  );
}

export default function VerifyToken() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando…</div>}>
      <VerifyTokenInner />
    </Suspense>
  );
}
