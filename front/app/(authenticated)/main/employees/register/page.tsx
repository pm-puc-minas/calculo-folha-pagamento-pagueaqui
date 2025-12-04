"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectItem } from "@/app/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Calendar, IdCard, Lock, User2, Wallet, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEmployeeRegistration } from "@/app/context/employeeRegistrationContext";
import api from "@/app/lib/axios";

const personalSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  sobrenome: z.string().min(1, "Informe o sobrenome"),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional(),
  cpf: z
    .string()
    .min(11, "CPF é obrigatório")
    .refine((val) => (val || "").replace(/\D/g, "").length === 11, "CPF deve ter 11 dígitos"),
  rg: z.string().optional(),
  dataDeNascimento: z.string().optional(),
  estadoCivil: z.string().optional(),
  genero: z.string().optional(),
  nacionalidade: z.string().optional(),
  rua: z.string().optional(),
  bairro: z.string().optional(),
  numero: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
});

type PersonalForm = z.infer<typeof personalSchema>;

const maritalOptions = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
];

const genderOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "outro", label: "Outro" },
];

const states = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function EmployeeRegisterStep1() {
  const router = useRouter();
  const { personalData, updatePersonalData } = useEmployeeRegistration();
  const methods = useForm<PersonalForm>({ 
    resolver: zodResolver(personalSchema),
    defaultValues: personalData,
  });
  const zipValue = methods.watch("cep");
  const cpfValue = methods.watch("cpf");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const lastCepRef = useRef<string | null>(null);
  const [cpfChecking, setCpfChecking] = useState(false);
  const lastCpfRef = useRef<string | null>(null);

  useEffect(() => {
    const onlyDigits = (zipValue || "").replace(/\D/g, "");
    if (onlyDigits.length !== 8) {
      setCepError(null);
      return;
    }

    if (lastCepRef.current === onlyDigits) return;
    lastCepRef.current = onlyDigits;

    const controller = new AbortController();
    (async () => {
      try {
        setCepLoading(true);
        setCepError(null);
        const res = await fetch(`https://viacep.com.br/ws/${onlyDigits}/json/`, {
          signal: controller.signal,
          headers: { "Accept": "application/json" },
        });
        if (!res.ok) return;
        const data: any = await res.json();
        if (data?.erro) {
          setCepError("CEP não encontrado");
          return;
        }
  methods.setValue("rua", data.logradouro || "");
  methods.setValue("bairro", data.bairro || "");
  methods.setValue("cidade", data.localidade || "");
        methods.setValue("estado", data.uf || "");
        methods.setValue("cep", data.cep || zipValue);
        setCepError(null);
      } catch (_) {
        setCepError("Falha ao consultar o CEP");
      } finally {
        setCepLoading(false);
      }
    })();

    return () => controller.abort();
  }, [zipValue, methods]);

  useEffect(() => {
    const onlyDigits = (cpfValue || "").replace(/\D/g, "");
    if (onlyDigits.length !== 11) {
      methods.clearErrors("cpf");
      return;
    }

    // evita reconsultas duplicadas
    if (lastCpfRef.current === onlyDigits) return;
    lastCpfRef.current = onlyDigits;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setCpfChecking(true);
        const res = await api.get("/funcionario/list", {
          signal: controller.signal as any,
          headers: { Accept: "application/json" },
        });
        let list: any[] = [];
        if (Array.isArray(res.data)) {
          list = res.data as any[];
        } else if (typeof res.data === "string") {
          try {
            const parsed = JSON.parse(res.data);
            list = Array.isArray(parsed) ? parsed : [];
          } catch {
            list = [];
          }
        }
        const exists = list.some((u) => String(u?.cpf || "").replace(/\D/g, "") === onlyDigits);
        if (exists) {
          methods.setError("cpf", { type: "validate", message: "CPF já cadastrado" });
        } else {
          methods.clearErrors("cpf");
        }
      } catch (_) {
        // em falha de rede, não travar o usuário, apenas limpar estado
      } finally {
        setCpfChecking(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [cpfValue, methods]);

  const onSubmit = (data: PersonalForm) => {
    console.log("SUBMIT DISPARADO", data);
    updatePersonalData(data);
    router.push("/main/employees/register/professional");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-auto">
      <div className="bg-white border-b border-[#DEE2E6]">
        <div className="px-8 py-6">
          <h1 className="text-xl font-semibold text-[#212529]">Colaboradores</h1>
        </div>
        <div className="px-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList>
              <TabsTrigger value="personal" className="gap-2">
                <User2 className="w-4 h-4" /> Informações Pessoais
              </TabsTrigger>
              <TabsTrigger 
                value="professional" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/professional")}
              >
                <IdCard className="w-4 h-4" /> Informações Profissionais
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/documents")}
              >
                <Calendar className="w-4 h-4" /> Documentos
              </TabsTrigger>
              <TabsTrigger 
                value="bank" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/bank")}
              >
                <Wallet className="w-4 h-4" /> Dados Bancários
              </TabsTrigger>
              <TabsTrigger 
                value="credentials" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/credentials")}
              >
                <Lock className="w-4 h-4" /> Credenciais
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="px-8 py-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input methods={methods} name="nome" label="Nome" placeholder="Nome" />
            <Input methods={methods} name="sobrenome" label="Sobrenome" placeholder="Sobrenome" />

            <Input
              methods={methods}
              name="telefone"
              label="Telefone"
              placeholder="(00) 00000-0000"
              mask={["(99) 9999-9999", "(99) 99999-9999"]}
            />
            <Input
              methods={methods}
              name="cpf"
              label="CPF"
              placeholder="000.000.000-00"
              mask={"999.999.999-99"}
              endContent={
                cpfChecking ? (
                  <Loader2 className="animate-spin text-gray-300 mr-3" />
                ) : null
              }
            />
            <Input
              methods={methods}
              name="rg"
              label="RG"
              placeholder="00.000.000"
              mask={"99.999.999"}
            />
            <Input methods={methods} name="email" label="E-mail" placeholder="email@exemplo.com" />

            <Input
              methods={methods}
              name="dataDeNascimento"
              label="Data de Nascimento"
              type="date"
            />
            <Select
              methods={methods}
              name="estadoCivil"
              placeholder="Estado Civil"
              label="Estado Civil"
            >
              {maritalOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              methods={methods}
              name="genero"
              placeholder="Gênero"
              label="Gênero"
            >
              {genderOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
            <Input methods={methods} name="nationality" label="Nacionalidade" placeholder="Brasileira" />
            
            <div className="flex flex-col gap-1">
              <Input
                methods={methods}
                name="cep"
                label="CEP"
                placeholder="00000-000"
                mask={"99999-999"}
                endContent={
                  cepLoading ? (
                    <Loader2 className="animate-spin text-gray-300 mr-3" />
                  ) : cepError ? (
                    <AlertCircle className="text-red-500 mr-3" />
                  ) : zipValue && zipValue.replace(/\D/g, "").length === 8 ? (
                    <CheckCircle2 className="text-green-500 mr-3" />
                  ) : null
                }
              />
              {cepError && (
                <span className="text-xs text-red-500">{cepError}</span>
              )}
            </div>

            {/* Rua */}
            <Input methods={methods} name="rua" label="Rua" placeholder="Rua" />

            {/* Bairro */}
            <Input methods={methods} name="bairro" label="Bairro" placeholder="Bairro" />

            {/* Número */}
            <Input methods={methods} name="numero" label="Número" placeholder="Número" />

            {/* Cidade */}
            <Input methods={methods} name="cidade" label="Cidade" placeholder="Cidade" />

            <Select methods={methods} name="estado" placeholder="Estado" label="Estado">
              {states.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/main/employees")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white"
              disabled={!!methods.formState.errors.cpf || cpfChecking}
            >
              Próximo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
