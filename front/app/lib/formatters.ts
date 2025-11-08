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

export function toTitleCase(input?: string) {
  if (!input) return '';
  return input
    .toLocaleLowerCase('pt-BR')
    .replace(/\b([\p{L}\p{M}]+)/gu, (w) =>
      w.charAt(0).toLocaleUpperCase('pt-BR') + w.slice(1),
    );
}

export function formatDateBR(input?: string) {
  if (!input) return '';
  const m = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    return `${m[3]}/${m[2]}/${m[1]}`;
  }

  const tryDate = new Date(input);
  if (!isNaN(tryDate.getTime())) {
    const d = tryDate;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return input;
}

export function toIsoNoonUTC(dateOnly?: string) {
  if (!dateOnly) return undefined as unknown as string;
  const m = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return dateOnly; // devolve como veio se não estiver no formato esperado
  return `${m[1]}-${m[2]}-${m[3]}T12:00:00.000Z`;
}

