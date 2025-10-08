export function formatCNPJ(cnpj: string) {
  cnpj = cnpj?.replace(/\D/g, '');

  return cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export function formatCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, '');
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function handleDocument(document: string) {
  if (document?.replace(/\D/g, '')?.length === 11) {
    return formatCPF(document);
  }
  return formatCNPJ(document);
}

export function formatPhoneNumber(number: string) {
  number = number.replace(/\D/g, '');
  return number.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
}

