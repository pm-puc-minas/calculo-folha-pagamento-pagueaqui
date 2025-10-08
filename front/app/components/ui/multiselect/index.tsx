'use client';
import { cn } from '@/app/lib/utils';
import { AlertCircle } from 'lucide-react';
import { memo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { ClassNameValue } from 'tailwind-merge';
import { Multiselect as MultiselectComp, MultiSelectProps } from './base_component';

interface SelectProps extends MultiSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods?: UseFormReturn<any, any, any>;
  name: string;
  label?: string;
  containerClass?: ClassNameValue;
  labelClass?: ClassNameValue;
  id?: string;
  labelComponent?: React.ReactNode;
}

export const Multiselect = memo(
  ({ methods, containerClass, label, labelClass, labelComponent, ...props }: SelectProps) => {
    const errorMessage = methods?.formState.errors[props.name]?.message;
    return (
      <div className={cn('flex-col gap-2 flex-1 w-full flex', containerClass)} id="selectContainer">
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              'flex text-[#25262B] font-medium text-sm items-center gap-1.5',
              labelClass,
            )}>
            {label}
            {labelComponent}
          </label>
        )}
        {methods?.control ? (
          <Controller
            name={props.name}
            defaultValue={props.defaultValues}
            control={methods.control}
            disabled={props.disabled}
            render={({ field: { onChange, value, disabled } }) => (
              <>
                <MultiselectComp
                  {...props}
                  customMarginHeight={label ? 35 : undefined}
                  values={props.values || value}
                  disabled={disabled}
                  onValueChange={onChange}
                />
              </>
            )}
          />
        ) : (
          <MultiselectComp {...props} customMarginHeight={label ? 35 : undefined} />
        )}
        {!!errorMessage && (
          <p className="text-red-500 dark:text-red-600 text-sm">
            <AlertCircle className="size-4 mr-1.5 inline" />
            {errorMessage as string}
          </p>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps === nextProps,
);

Multiselect.displayName = 'Multiselect';
