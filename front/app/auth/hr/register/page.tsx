"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CompanyForm, type CompanyFormValues } from './_components/form-step1';
import { AccountForm } from './_components/form-step2';

export default function Register() {
  const [step, setStep] = useState(1);
  const [companyData, setCompanyData] = useState<CompanyFormValues | null>(null);
  
  return (
    <>
      <div className="flex flex-col gap-7">
        <div className="flex justify-center pt-6 md:hidden">
          <Image src="/logo.png" alt="Logo PagueAqui" width={200} height={33} />
        </div>
        <div className="space-y-2">
          <h1 className="text-[#343A40] text-center text-2xl font-semibold">
            {step === 1 ? 'Cadastre sua empresa' : 'Crie sua conta' }
          </h1>
          <p className="text-[#909296] text-center text-sm font-medium">
            Dê o primeiro passo para transformar <br /> a gestão de Folhas de Pagamento.
          </p>
        </div>
        {step === 1 ? (
          <CompanyForm 
            onNext={() => setStep(2)} 
            onSubmitCompanyData={setCompanyData}
          />
        ) : (
          <AccountForm 
            onBack={() => setStep(1)} 
            onDone={() => (window.location.href = '/auth/hr/login')}
            companyData={companyData}
          />
        )}
        <div className="text-[#343A40] text-sm font-medium text-balance text-center">
          <p>Ao continuar, você concorda com os</p>
          <div className="flex gap-1">
            <Link
              target="_blank"
              href="/"
              className="text-primary font-semibold">
              Termos de uso
            </Link>
            e
            <Link
              target="_blank"
              href="/"
              className="text-primary font-semibold">
              Políticas de privacidade <p className="text-[#343A40] ">.</p>
            </Link>
          </div>
        </div>
        <p className="text-[#343A40] text-sm font-medium text-center">
          Já possui uma conta?
          <Link className="text-[#4000FE] ml-1 hover:underline font-semibold" href="/auth/hr/login">
            Fazer login
          </Link>
        </p>
      </div>
    </>
  );
}
