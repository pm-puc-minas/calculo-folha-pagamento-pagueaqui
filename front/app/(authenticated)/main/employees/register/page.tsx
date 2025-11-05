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

const personalSchema = z.object({
  firstName: z.string().min(1, "Informe o nome"),
  lastName: z.string().min(1, "Informe o sobrenome"),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional(),
  birthDate: z.string().optional(),
  maritalStatus: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  street: z.string().optional(),
  district: z.string().optional(),
  number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
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
  const zipValue = methods.watch("zip");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const lastCepRef = useRef<string | null>(null);

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
  methods.setValue("street", data.logradouro || "");
  methods.setValue("district", data.bairro || "");
  methods.setValue("city", data.localidade || "");
        methods.setValue("state", data.uf || "");
        methods.setValue("zip", data.cep || zipValue);
        setCepError(null);
      } catch (_) {
        setCepError("Falha ao consultar o CEP");
      } finally {
        setCepLoading(false);
      }
    })();

    return () => controller.abort();
  }, [zipValue, methods]);

  const onSubmit = (data: PersonalForm) => {
    updatePersonalData(data);
    router.push("/main/employees/register/professional");
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl">
        <div className="px-6 md:px-8 pt-4">
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
              <TabsTrigger value="documents" disabled className="gap-2">
                <Calendar className="w-4 h-4" /> Documentos
              </TabsTrigger>
              <TabsTrigger value="bank" disabled className="gap-2">
                <Wallet className="w-4 h-4" /> Dados Bancários
              </TabsTrigger>
              <TabsTrigger value="credentials" disabled className="gap-2">
                <Lock className="w-4 h-4" /> Credenciais
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-6" />
          </Tabs>
        </div>

        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="px-6 md:px-8 pb-6 md:pb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input methods={methods} name="firstName" label="Nome" placeholder="Nome" />
            <Input methods={methods} name="lastName" label="Sobrenome" placeholder="Sobrenome" />

            <Input
              methods={methods}
              name="phone"
              label="Telefone"
              placeholder="(00) 00000-0000"
              mask={["(99) 9999-9999", "(99) 99999-9999"]}
            />
            <Input methods={methods} name="email" label="E-mail" placeholder="email@exemplo.com" />

            <Input
              methods={methods}
              name="birthDate"
              label="Data de Nascimento"
              type="date"
            />
            <Select
              methods={methods}
              name="maritalStatus"
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
              name="gender"
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

            {/* CEP antes do endereço, com loading/erro do ViaCep */}
            <div className="flex flex-col gap-1">
              <Input
                methods={methods}
                name="zip"
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
            <Input methods={methods} name="street" label="Rua" placeholder="Rua" />

            {/* Bairro */}
            <Input methods={methods} name="district" label="Bairro" placeholder="Bairro" />

            {/* Número */}
            <Input methods={methods} name="number" label="Número" placeholder="Número" />

            {/* Cidade */}
            <Input methods={methods} name="city" label="Cidade" placeholder="Cidade" />

            <Select methods={methods} name="state" placeholder="Estado" label="Estado">
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
            <Button type="submit" className="bg-primary text-white">
              Próximo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
