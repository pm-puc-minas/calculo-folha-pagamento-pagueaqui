"use client";

import { useListarTodas } from "@/app/lib/api/generated/folha-pagamento-controller/folha-pagamento-controller";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";

export function ProximosPagamentosCard() {
  const { data: folhas, isLoading, error } = useListarTodas();

  // calcular o total de pgtos para o próximo mes
  const dataAtual = new Date();
  const proximoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1);
  const mesProximo = proximoMes.getMonth();
  const anoProximo = proximoMes.getFullYear();

  const folhasProximoMes = folhas?.filter((folha) => {
    const dataFolha = new Date(folha.dataFolha);
    return (
      dataFolha.getMonth() === mesProximo &&
      dataFolha.getFullYear() === anoProximo
    );
  }) || [];

  const totalProximosPagamentos = folhasProximoMes.reduce(
    (acc, folha) => acc + (folha.valorTotal || 0),
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="bg-white rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-500 font-medium">
            Próximos pagamentos
          </p>
          {isLoading ? (
            <div className="h-10 w-48 bg-gray-200 animate-pulse rounded" />
          ) : error ? (
            <p className="text-2xl font-bold text-red-500">Erro</p>
          ) : (
            <h3 className="text-4xl font-bold text-gray-900">
              {formatCurrency(totalProximosPagamentos)}
            </h3>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
