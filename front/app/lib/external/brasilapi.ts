export type BrasilApiBank = {
  ispb: string;
  name: string;
  code: number | null;
  full_name: string;
};

/**
 * busca banco pelo código COMPE (3 digitos)
 * docs: https://brasilapi.com.br/docs#tag/BANKS
 */
export async function getBankByCode(code: string, opts?: { signal?: AbortSignal }): Promise<BrasilApiBank> {
  const sanitized = (code || '').trim();
  if (!/^\d{3}$/.test(sanitized)) {
    throw new Error('Informe um código de banco válido (3 dígitos)');
  }

  const res = await fetch(`https://brasilapi.com.br/api/banks/v1/${sanitized}` , {
    method: 'GET',
    signal: opts?.signal,
    headers: {
      'accept': 'application/json',
    },
  });

  if (!res.ok) {
    const msg = res.status === 404 ? 'Banco não encontrado' : `Erro ao buscar banco (${res.status})`;
    throw new Error(msg);
  }

  const data = (await res.json()) as BrasilApiBank;
  return data;
}

/**
 * busca o banco por ISPB
 */
export async function getBankByIspb(ispb: string, opts?: { signal?: AbortSignal }): Promise<BrasilApiBank> {
  const sanitized = (ispb || '').trim();
  if (!/^\d{8}$/.test(sanitized)) {
    throw new Error('Informe um ISPB válido (8 dígitos)');
  }

  const res = await fetch(`https://brasilapi.com.br/api/banks/v1/ispb/${sanitized}` , {
    method: 'GET',
    signal: opts?.signal,
    headers: {
      'accept': 'application/json',
    },
  });

  if (!res.ok) {
    const msg = res.status === 404 ? 'Banco não encontrado' : `Erro ao buscar banco (${res.status})`;
    throw new Error(msg);
  }

  const data = (await res.json()) as BrasilApiBank;
  return data;
}
