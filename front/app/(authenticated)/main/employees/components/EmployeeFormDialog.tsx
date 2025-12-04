/**
 * EmployeeFormDialog Component
 * Modal form for creating/editing employees with tabs following design system
 */

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogMain,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Select, SelectItem } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { User2, Briefcase, FileText, Building2, Lock } from "lucide-react";
import type { Employee, EmployeeFormInput } from "../types";

const employeeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sobrenome: z.string().min(1, "Sobrenome é obrigatório"),
  cpf: z.string().min(1, "CPF é obrigatório"),
  rg: z.string().optional(),
  email: z.string().email("E-mail inválido"),
  endereco: z.string().optional(),
  dataNascimento: z.string().optional(),
  pis: z.number().optional(),
  dataDeAdmissao: z.string().optional(),
  cargo: z.string().optional(),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  salarioBruto: z.number().optional(),
});

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
  onSubmit: (data: EmployeeFormInput) => void;
  isSubmitting?: boolean;
}

const maritalOptions = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
];

const genderOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
];

const states = ["AC", "AL", "SP", "RJ", "MG"];

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  onSubmit,
  isSubmitting = false,
}: EmployeeFormDialogProps) {
  const isEditing = !!employee?.id;
  const [activeTab, setActiveTab] = useState("personal");

  const methods = useForm<any>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (!open) {
      methods.reset();
      setActiveTab("personal");
    }
  }, [open, methods]);

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-8 py-6 border-b border-[#DEE2E6]">
          <h2 className="text-xl font-semibold text-[#212529]">Colaboradores</h2>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-8 pt-4 border-b border-[#DEE2E6]">
              <TabsList>
                <TabsTrigger value="personal" className="gap-2">
                  <User2 className="w-4 h-4" />
                  Informações Pessoais
                </TabsTrigger>
                <TabsTrigger value="professional" className="gap-2">
                  <Briefcase className="w-4 h-4" />
                  Informações Profissionais
                </TabsTrigger>
                <TabsTrigger value="documents" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="bank" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  Dados Bancários
                </TabsTrigger>
                <TabsTrigger value="credentials" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Credenciais
                </TabsTrigger>
              </TabsList>
            </div>

            <DialogMain className="overflow-y-auto px-8 py-6">
              <form id="employee-form" onSubmit={handleSubmit}>
                <TabsContent value="personal" className="mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <Input methods={methods} name="nome" label="Nome" placeholder="Nome" required />
                    <Input methods={methods} name="sobrenome" label="Sobrenome" placeholder="Sobrenome" required />
                    <Input methods={methods} name="telefone" label="Telefone" placeholder="Telefone" />
                    <Input methods={methods} name="email" label="E-mail" placeholder="E-mail" type="email" required />
                    <Input methods={methods} name="cpf" label="CPF" mask="999.999.999-99" required />
                    <Input methods={methods} name="rg" label="RG" mask="99.999.999" />
                    <Input methods={methods} name="dataNascimento" label="Data de Nascimento" type="date" />
                    <Select methods={methods} name="estadoCivil" placeholder="Estado Civil" label="Estado Civil">
                      {maritalOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </Select>
                    <Select methods={methods} name="genero" placeholder="Gênero" label="Gênero">
                      {genderOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </Select>
                    <Input methods={methods} name="nacionalidade" label="Nacionalidade" placeholder="Nacionalidade" />
                    <div className="col-span-2">
                      <Input methods={methods} name="endereco" label="Endereço" placeholder="Endereço" />
                    </div>
                    <Select methods={methods} name="cidade" placeholder="Cidade" label="Cidade">
                      <SelectItem value="bh">Belo Horizonte</SelectItem>
                    </Select>
                    <Select methods={methods} name="estado" placeholder="Estado" label="Estado">
                      {states.map((uf) => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </Select>
                    <Select methods={methods} name="cep" placeholder="CEP" label="CEP">
                      <SelectItem value="30000">30000-000</SelectItem>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <Input methods={methods} name="cargo" label="Cargo" placeholder="Cargo" />
                    <Input methods={methods} name="dataDeAdmissao" label="Data de admissão" type="date" />
                    <Input methods={methods} name="pis" label="PIS/PASEP" isNumeric allowNegative={false} />
                    <Input methods={methods} name="salarioBruto" label="Salário Bruto" isNumeric prefix="R$ " decimalScale={2} />
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    {["Currículo", "Recibos", "Carta de demissão", "Recomendações"].map((doc) => (
                      <div key={doc} className="border-2 border-dashed border-[#DEE2E6] rounded-lg p-6 text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg width="24" height="24" fill="none" className="text-primary">
                            <path d="M12 16V8m0 0l-4 4m4-4l4 4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-[#212529] mb-1">{doc}</p>
                        <p className="text-xs text-[#868E96] mb-2">
                          Arraste & Solte ou <button type="button" className="text-primary">escolha o arquivo</button>
                        </p>
                        <p className="text-xs text-[#ADB5BD]">Formatos suportados: .jpeg, .pdf</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="bank" className="mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <Input methods={methods} name="conta" label="Conta" />
                    <Input methods={methods} name="digitoVerificador" label="Dígito Verificador" />
                    <Input methods={methods} name="agencia" label="Agência" />
                    <Select methods={methods} name="banco" placeholder="Banco" label="Banco">
                      <SelectItem value="001">Banco do Brasil</SelectItem>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="credentials" className="mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <Input methods={methods} name="email" label="E-mail Profissional" type="email" required />
                    <Input methods={methods} name="senha" label="Senha" type="password" required={!isEditing} />
                  </div>
                </TabsContent>
              </form>
            </DialogMain>
          </Tabs>
        </div>

        <DialogFooter className="px-8 py-4 border-t border-[#DEE2E6]">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          {activeTab !== "credentials" ? (
            <Button onClick={() => setActiveTab(activeTab === "personal" ? "professional" : activeTab === "professional" ? "documents" : activeTab === "documents" ? "bank" : "credentials")}>
              Próximo
            </Button>
          ) : (
            <Button type="submit" form="employee-form" isLoading={isSubmitting}>
              Salvar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
