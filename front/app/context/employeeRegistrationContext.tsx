"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
export type PersonalData = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  maritalStatus?: string;
  gender?: string;
  nationality?: string;
  street?: string;
  district?: string;
  number?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type ProfessionalData = {
  employeeId?: string;
  position?: string;
  professionalEmail?: string;
  department?: string;
  admissionDate?: string;
  pisPasep?: string;
  dependents?: number;
};

export type DocumentsData = {
  curriculum?: File | null;
  receipts?: File | null;
  dismissalLetter?: File | null;
  recommendations?: File | null;
};

export type BankData = {
  account?: string;
  agency?: string;
  verificationDigit?: string;
  bank?: string;
  bankCode?: string;
};

export type CredentialsData = {
  professionalEmail?: string;
  password?: string;
};

type EmployeeRegistrationContextType = {
  personalData: PersonalData;
  professionalData: ProfessionalData;
  documentsData: DocumentsData;
  bankData: BankData;
  credentialsData: CredentialsData;
  updatePersonalData: (data: PersonalData) => void;
  updateProfessionalData: (data: ProfessionalData) => void;
  updateDocumentsData: (data: DocumentsData) => void;
  updateBankData: (data: BankData) => void;
  updateCredentialsData: (data: CredentialsData) => void;
  clearAll: () => void;
};

const EmployeeRegistrationContext = createContext<EmployeeRegistrationContextType | undefined>(
  undefined
);

export function EmployeeRegistrationProvider({ children }: { children: ReactNode }) {
  const [personalData, setPersonalData] = useState<PersonalData>({});
  const [professionalData, setProfessionalData] = useState<ProfessionalData>({});
  const [documentsData, setDocumentsData] = useState<DocumentsData>({});
  const [bankData, setBankData] = useState<BankData>({});
  const [credentialsData, setCredentialsData] = useState<CredentialsData>({});

  const updatePersonalData = (data: PersonalData) => {
    setPersonalData((prev) => ({ ...prev, ...data }));
  };

  const updateProfessionalData = (data: ProfessionalData) => {
    setProfessionalData((prev) => ({ ...prev, ...data }));
  };

  const updateDocumentsData = (data: DocumentsData) => {
    setDocumentsData((prev) => ({ ...prev, ...data }));
  };

  const updateBankData = (data: BankData) => {
    setBankData((prev) => ({ ...prev, ...data }));
  };

  const updateCredentialsData = (data: CredentialsData) => {
    setCredentialsData((prev) => ({ ...prev, ...data }));
  };

  const clearAll = () => {
    setPersonalData({});
    setProfessionalData({});
    setDocumentsData({});
    setBankData({});
    setCredentialsData({});
  };

  return (
    <EmployeeRegistrationContext.Provider
      value={{
        personalData,
        professionalData,
        documentsData,
        bankData,
        credentialsData,
        updatePersonalData,
        updateProfessionalData,
        updateDocumentsData,
        updateBankData,
        updateCredentialsData,
        clearAll,
      }}
    >
      {children}
    </EmployeeRegistrationContext.Provider>
  );
}

export function useEmployeeRegistration() {
  const context = useContext(EmployeeRegistrationContext);
  if (!context) {
    throw new Error(
      "useEmployeeRegistration must be used within EmployeeRegistrationProvider"
    );
  }
  return context;
}
