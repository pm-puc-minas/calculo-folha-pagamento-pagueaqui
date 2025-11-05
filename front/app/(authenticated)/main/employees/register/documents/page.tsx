"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Calendar, IdCard, Lock, User2, Wallet, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useEmployeeRegistration } from "@/app/context/employeeRegistrationContext";

const documentsSchema = z.object({
  curriculum: z.any().optional(),
  receipts: z.any().optional(),
  dismissalLetter: z.any().optional(),
  recommendations: z.any().optional(),
});

type DocumentsForm = z.infer<typeof documentsSchema>;

type DocumentUploadProps = {
  title: string;
  name: string;
  formats: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
};

function DocumentUpload({ title, formats, onFileSelect, file }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm text-gray-600 mb-1 text-center">
          Arraste & Solte ou{" "}
          <label className="text-primary cursor-pointer hover:underline">
            escolha o arquivo
            <input
              type="file"
              className="hidden"
              accept=".jpeg,.jpg,.pdf"
              onChange={handleFileChange}
            />
          </label>{" "}
          para fazer upload
        </p>
        <p className="text-xs text-gray-400">{formats}</p>
        {file && (
          <div className="mt-3 text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded">
            📎 {file.name}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmployeeRegisterStep3() {
  const router = useRouter();
  const { documentsData, updateDocumentsData } = useEmployeeRegistration();
  
  const methods = useForm<DocumentsForm>({
    resolver: zodResolver(documentsSchema),
  });

  const [curriculum, setCurriculum] = useState<File | null>(documentsData.curriculum || null);
  const [receipts, setReceipts] = useState<File | null>(documentsData.receipts || null);
  const [dismissalLetter, setDismissalLetter] = useState<File | null>(documentsData.dismissalLetter || null);
  const [recommendations, setRecommendations] = useState<File | null>(documentsData.recommendations || null);

  useEffect(() => {
    setCurriculum(documentsData.curriculum || null);
    setReceipts(documentsData.receipts || null);
    setDismissalLetter(documentsData.dismissalLetter || null);
    setRecommendations(documentsData.recommendations || null);
  }, [documentsData]);

  const onSubmit = (data: DocumentsForm) => {
    updateDocumentsData({
      curriculum,
      receipts,
      dismissalLetter,
      recommendations,
    });
    console.log("Step 3 - Documentos:", {
      ...data,
      curriculum,
      receipts,
      dismissalLetter,
      recommendations,
    });
    router.push("/main/employees/register/bank");
  };

  const handleBack = () => {
    updateDocumentsData({
      curriculum,
      receipts,
      dismissalLetter,
      recommendations,
    });
    router.push("/main/employees/register/professional");
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl">
        <div className="px-6 md:px-8 pt-4">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList>
              <TabsTrigger
                value="personal"
                className="gap-2"
                onClick={() => router.push("/main/employees/register")}
              >
                <User2 className="w-4 h-4" /> Informações Pessoais
              </TabsTrigger>
              <TabsTrigger
                value="professional"
                className="gap-2"
                onClick={() => router.push("/main/employees/register/professional")}
              >
                <IdCard className="w-4 h-4" /> Informações Profissionais
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-2">
                <Calendar className="w-4 h-4" /> Documentos
              </TabsTrigger>
              <TabsTrigger 
                value="bank" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/bank")}
              >
                <Wallet className="w-4 h-4" /> Dados Bancários
              </TabsTrigger>
              <TabsTrigger 
                value="credentials" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/credentials")}
              >
                <Lock className="w-4 h-4" /> Credenciais
              </TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="mt-6" />
          </Tabs>
        </div>

        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="px-6 md:px-8 pb-6 md:pb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Currículo */}
            <DocumentUpload
              title="Currículo"
              name="curriculum"
              formats="Formatos suportados: .jpeg, .pdf"
              onFileSelect={setCurriculum}
              file={curriculum}
            />

            {/* Recibos */}
            <DocumentUpload
              title="Recibos"
              name="receipts"
              formats="Formatos suportados: .jpeg, .pdf"
              onFileSelect={setReceipts}
              file={receipts}
            />

            {/* Carta de demissão */}
            <DocumentUpload
              title="Carta de demissão"
              name="dismissalLetter"
              formats="Formatos suportados: .jpeg, .pdf"
              onFileSelect={setDismissalLetter}
              file={dismissalLetter}
            />

            {/* Recomendações */}
            <DocumentUpload
              title="Recomendações"
              name="recommendations"
              formats="Supported formats: .jpeg, .pdf"
              onFileSelect={setRecommendations}
              file={recommendations}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleBack}>
              Voltar
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
