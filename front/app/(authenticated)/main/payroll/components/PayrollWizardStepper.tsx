/**
 * PAYROLL WIZARD STEPPER
 * Multi-step form for creating payroll following the exact workflow from design
 */

'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { WIZARD_STEPS, type WizardStepId } from '../types';

interface PayrollWizardStepperProps {
  currentStep: WizardStepId;
  completedSteps: Set<WizardStepId>;
  onStepClick?: (stepId: WizardStepId) => void;
}

export function PayrollWizardStepper({
  currentStep,
  completedSteps,
  onStepClick,
}: PayrollWizardStepperProps) {
  const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav 
      className="w-full bg-white border-b border-[#DEE2E6] px-8 py-4"
      aria-label="Progresso do cadastro de folha"
    >
      <ol className="flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = step.id === currentStep;
          const isPast = index < currentStepIndex;
          const isClickable = onStepClick && (isPast || isCompleted);

          return (
            <li
              key={step.id}
              className="flex items-center flex-1"
            >
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center gap-3 w-full transition-colors group',
                  isClickable && 'cursor-pointer hover:opacity-80',
                  !isClickable && 'cursor-default'
                )}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${step.label} - ${
                  isCompleted ? 'Concluído' : isCurrent ? 'Atual' : 'Pendente'
                }`}
              >
                {/* Step Number/Check */}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors',
                    isCompleted &&
                      'bg-green-500 text-white',
                    isCurrent &&
                      'bg-primary text-white',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-[#E9ECEF] text-[#868E96]'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.order}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    'text-sm font-medium transition-colors hidden md:inline',
                    isCurrent && 'text-primary',
                    isCompleted && 'text-green-600',
                    !isCurrent && !isCompleted && 'text-[#868E96]'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector Line */}
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-[2px] flex-1 mx-2 transition-colors',
                    (isCompleted || isPast) ? 'bg-green-500' : 'bg-[#DEE2E6]'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: Show current step label below */}
      <div className="mt-3 md:hidden text-center">
        <span className="text-sm font-medium text-primary">
          {WIZARD_STEPS.find((s) => s.id === currentStep)?.label}
        </span>
      </div>
    </nav>
  );
}
