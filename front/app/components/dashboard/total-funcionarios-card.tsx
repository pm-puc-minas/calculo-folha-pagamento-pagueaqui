// "use client";

// import { useListUsers } from "@/app/lib/api/generated/funcionario-controller/funcionario-controller";
// import { Users, TrendingUp } from "lucide-react";
// import { Card, CardContent } from "@/app/components/ui/card";

// export function TotalFuncionariosCard() {
//   const { data, isLoading, error } = useListUsers();

//   // const funcionarios = data ? (typeof data === 'string' ? JSON.parse(data) : data) : [];
//   const totalFuncionarios = Array.isArray(funcionarios) ? funcionarios.length : 0;

//   const percentageIncrease = 12;

//   return (
//     <Card className="bg-white rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="p-3 bg-purple-50 rounded-xl">
//             <Users className="h-6 w-6 text-purple-600" />
//           </div>
//           <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
//             <TrendingUp className="h-3 w-3 text-green-600" />
//             <span className="text-xs font-medium text-green-600">
//               {percentageIncrease}%
//             </span>
//           </div>
//         </div>
        
//         <div className="space-y-1">
//           <p className="text-sm text-gray-500 font-medium">
//             Total de Funcionários
//           </p>
//           {isLoading ? (
//             <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
//           ) : error ? (
//             <p className="text-2xl font-bold text-red-500">Erro</p>
//           ) : (
//             <h3 className="text-4xl font-bold text-gray-900">
//               {totalFuncionarios}
//             </h3>
//           )}
//           <p className="text-xs text-gray-400 mt-2">
//             Última atualização: {new Date().toLocaleDateString('pt-BR')}
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
