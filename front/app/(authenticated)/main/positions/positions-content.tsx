"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Briefcase, CheckCircle2, Eye, Pencil, Trash2, Users as UsersIcon } from "lucide-react";
import { CreatePositionDialog } from "./_components/create-position-dialog";

export type Position = {
  id: string;
  name: string;
  department: string;
  baseSalary: number;
  status: "Ativo" | "Inativo";
  links: number;
};

export function PositionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccessMessage(true);
      const timeout = setTimeout(() => {
        setShowSuccessMessage(false);
        router.replace("/main/positions");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [searchParams, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return positions;
    return positions.filter((p) => p.name.toLowerCase().includes(q) || p.department.toLowerCase().includes(q));
  }, [positions, query]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-start gap-3 max-w-md animate-in slide-in-from-top-5">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 text-sm mb-1">Cargo criado com sucesso</h3>
            <p className="text-xs text-green-700">O cargo foi cadastrado LOCALMENTE.</p>
          </div>
          <button onClick={() => setShowSuccessMessage(false)} className="text-green-600 hover:text-green-800">
            ×
          </button>
        </div>
      )}

      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span className="text-2xl font-semibold text-gray-900">{positions.length}</span>
          <span className="text-sm text-gray-500">Cargos</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Input
              name="search"
              placeholder="Buscar cargos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-3"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-4" onClick={() => setOpen(true)}>
              <UsersIcon className="w-4 h-4" />
              Cadastrar Cargo
            </Button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 bg-background overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <Image src="/mocks/EmptyState.png" alt="Nenhum cargo cadastrado" width={285} height={177} className="mx-auto mb-6 opacity-100" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-background overflow-y-auto p-8">
          <div className="bg-white rounded-lg border">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b text-sm text-gray-500">
              <div className="col-span-5">Cargo</div>
              <div className="col-span-2">Setor</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Vínculos</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>
            {filtered.map((p) => (
              <div key={p.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b last:border-0 items-center">
                <div className="col-span-5 text-gray-900 truncate">{p.name}</div>
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-md border border-indigo-200 text-indigo-700 bg-indigo-50">
                    {p.department}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-md ${p.status === "Ativo" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>{p.status}</span>
                </div>
                <div className="col-span-1 text-gray-700">{p.links}</div>
                <div className="col-span-2 flex items-center justify-end gap-4 text-gray-700">
                  <Eye className="w-4 h-4" />
                  <Pencil className="w-4 h-4" />
                  <Trash2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CreatePositionDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={(position) => {
          setPositions((prev) => [position, ...prev]);
          setShowSuccessMessage(true);
        }}
      />
    </div>
  );
}
