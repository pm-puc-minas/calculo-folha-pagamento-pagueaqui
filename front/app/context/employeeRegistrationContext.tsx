"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
export type PersonalData = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
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

type EmployeeRegistrationContextType = {
  personalData: PersonalData;
  professionalData: ProfessionalData;
  updatePersonalData: (data: PersonalData) => void;
  updateProfessionalData: (data: ProfessionalData) => void;
  clearAll: () => void;
};

const EmployeeRegistrationContext = createContext<EmployeeRegistrationContextType | undefined>(
  undefined
);

export function EmployeeRegistrationProvider({ children }: { children: ReactNode }) {
  const [personalData, setPersonalData] = useState<PersonalData>({});
  const [professionalData, setProfessionalData] = useState<ProfessionalData>({});

  const updatePersonalData = (data: PersonalData) => {
    setPersonalData((prev) => ({ ...prev, ...data }));
  };

  const updateProfessionalData = (data: ProfessionalData) => {
    setProfessionalData((prev) => ({ ...prev, ...data }));
  };

  const clearAll = () => {
    setPersonalData({});
    setProfessionalData({});
  };

  return (
    <EmployeeRegistrationContext.Provider
      value={{
        personalData,
        professionalData,
        updatePersonalData,
        updateProfessionalData,
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
