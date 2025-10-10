"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as y from "yup";
import { Envelope, Lock, IdentificationCard, EnvelopeSimpleIcon, HashStraightIcon } from "@phosphor-icons/react";
import { usePublicAuthControllerRegister } from "@/actions/public-auth/public-auth";
import { useCreateCompany } from "@/actions/hr-payroll";
import { formatError } from "@/app/lib/axios";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type {
  BadRequestGenericResponseDto,
  ForbiddenGenericResponseDto,
  NotFoundGenericResponseDto,
  UnauthorizedGenericResponseDto,
} from "@/app/schemas/model";
import type { CompanyFormValues } from "./form-step1";
import { LockIcon, UserIcon } from "lucide-react";

const registerSchema = y.object({
  nome: y.string().required("Por favor, insira seu nome"),
  sobrenome: y.string().required("Por favor, insira seu sobrenome"),
  email: y.string().email("Por favor, insira um e-mail válido").required("Por favor, insira um e-mail"),
  password: y.string().min(8, "A senha deve ter pelo menos 8 caracteres").required("Por favor, insira sua senha"),
  confirmPassword: y
    .string()
    .oneOf([y.ref("password")], "As senhas devem ser iguais")
    .required("Por favor, confirme sua senha"),
  cpf: y
    .string()
    .transform((v) => (v ? v.replace(/\D/g, "") : v))
    .matches(/^\d{11}$/g, "CPF deve conter 11 dígitos numéricos")
    .required("Por favor, insira seu CPF"),
  // endereco removido conforme solicitação (não é mais coletado)
});

type RegisterFormValues = y.InferType<typeof registerSchema>;

export function AccountForm({ 
  onBack, 
  onDone, 
  companyData 
}: { 
  onBack: () => void; 
  onDone: () => void; 
  companyData: CompanyFormValues | null; 
}) {
  const methods = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate: createCompany, isPending: isCreatingCompany } = useCreateCompany({
    mutation: {
      onSuccess: () => {
        toast.success("Empresa cadastrada com sucesso");
      },
      onError: () => {
        toast.error("Não foi possível cadastrar a empresa. Tente novamente.");
      },
    },
  });

  const { mutate: createUser, isPending: isCreatingUser } = usePublicAuthControllerRegister<
    AxiosError<
      | BadRequestGenericResponseDto
      | UnauthorizedGenericResponseDto
      | ForbiddenGenericResponseDto
      | NotFoundGenericResponseDto
    >
  >({
    mutation: {
      onSuccess: () => {
        toast.success("Usuário criado com sucesso");
        onDone();
      },
      onError(error) {
        toast.error(formatError(error));
      },
    },
  });

  const handleSubmit = async (userData: RegisterFormValues) => {
    if (!companyData) {
      toast.error("Dados da empresa não encontrados. Volte ao step anterior.");
      return;
    }

    // Primeiro cadastra a empresa
    createCompany(
      { data: { razaoSocial: companyData.razaoSocial, cnpj: companyData.cnpj } },
      {
        onSuccess: () => {
          // Depois cadastra o usuário
          createUser({
            data: {
              nome: userData.nome,
              sobrenome: userData.sobrenome,
              email: userData.email,
              password: userData.password,
              cpf: userData.cpf, // já transformado para dígitos pelo yup
            },
          });
        },
      }
    );
  };

  const isPending = isCreatingCompany || isCreatingUser;

  return (
    <form
      onSubmit={methods.handleSubmit(handleSubmit)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4">
        <Input
          name="nome"
          label="Nome"
          placeholder="Amanda"
          required
          methods={methods}
          startContent={<UserIcon />}
        />
        <Input
          name="sobrenome"
          label="Sobrenome"
          placeholder="Oliveira"
          required
          methods={methods}
          startContent={<UserIcon />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input
          name="email"
          label="E-mail"
          placeholder="amanda.oliveira@email.com"
          required
          methods={methods}
          startContent={<EnvelopeSimpleIcon />}
        />
        <Input
          name="cpf"
          label="CPF"
          placeholder="Somente números"
          required
          methods={methods}
          mask="###.###.###-##"
          startContent={<HashStraightIcon />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input
          name="password"
          label="Senha"
          type="password"
          placeholder="***********"
          required
          methods={methods}
          startContent={<LockIcon />}
        />
        <Input
          name="confirmPassword"
          label="Confirme sua senha"
          type="password"
          placeholder="***********"
          required
          methods={methods}
          startContent={<LockIcon />}
        />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} disabled={isPending}>
          Voltar
        </Button>
        <Button isLoading={isPending}>Concluir cadastro</Button>
      </div>
    </form>
  );
}
