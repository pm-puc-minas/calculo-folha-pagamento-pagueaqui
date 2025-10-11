import * as y from "yup";

const onlyDigits = (v?: string) => (v ? v.replace(/\D/g, "") : v);

export const step1Schema = y.object({
  razaoSocial: y.string().min(2, "Informe a razão social").required("Razão social é obrigatória"),
  cnpj: y
    .string()
    .transform((value) => value ?? "")
    .test("cnpj-format", "CNPJ inválido", (value) => {
  const digits = onlyDigits(value) || "";
      // aceita 14 dígitos (sem máscara) ou 18 chars no formato
      const isDigits = /^\d{14}$/.test(digits);
      const isMasked = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(value || "");
      return isDigits || isMasked;
    })
    .required("CNPJ é obrigatório"),
});

export const step2Schema = y.object({
  name: y.string().min(2, "Informe seu nome completo").required("Nome obrigatório"),
  email: y.string().email("E-mail inválido").required("E-mail obrigatório"),
  cpf: y
    .string()
    .transform((value) => value ?? "")
    .test("cpf-format", "CPF inválido", (value) => {
  const digits = onlyDigits(value) || "";
      const isDigits = /^\d{11}$/.test(digits);
      const isMasked = /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(value || "");
      return isDigits || isMasked;
    })
    .required("CPF é obrigatório"),
  password: y.string().min(8, "Mínimo de 8 caracteres").required("Senha obrigatória"),
});

export type Step1Form = y.InferType<typeof step1Schema>;
export type Step2Form = y.InferType<typeof step2Schema>;
