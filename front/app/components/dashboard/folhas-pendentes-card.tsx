"use client";

import { useListarTodas } from "@/app/lib/api/generated/folha-pagamento-controller/folha-pagamento-controller";
import { ClipboardList, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";

export function FolhasPendentesCard() {
  const { data: folhas, isLoading, error } = useListarTodas();

  // filtrar folhas pendentes
  // precisa dessa lógica no back
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();

  const folhasPendentes = folhas?.filter((folha) => {
    const dataFolha = new Date(folha.dataFolha);
    return (
      dataFolha.getMonth() === mesAtual &&
      dataFolha.getFullYear() === anoAtual
    );
  }) || [];

  const totalPendentes = folhasPendentes.length;

  const percentageDecrease = 8;

  return (
    <Card className="bg-white rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <ClipboardList className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg">
            <TrendingDown className="h-3 w-3 text-red-600" />
            <span className="text-xs font-medium text-red-600">
              {percentageDecrease}%
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-500 font-medium">
            Folhas de Pagamento Pendentes
          </p>
          {isLoading ? (
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
          ) : error ? (
            <p className="text-2xl font-bold text-red-500">Erro</p>
          ) : (
            <h3 className="text-4xl font-bold text-gray-900">
              {totalPendentes}
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
