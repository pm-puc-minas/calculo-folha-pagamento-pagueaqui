'use client';
import { cn } from '@/app/lib/utils';
import {
  SelectContentProps,
  SelectItemProps,
  SelectProps as SelectPropsRadix,
  SelectTriggerProps,
} from '@radix-ui/react-select';
import { AlertCircle } from 'lucide-react';
import React, { memo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { ClassNameValue } from 'tailwind-merge';
import {
  SelectContent as SelectContentShadcn,
  SelectItem as SelectItemShadcn,
  Select as SelectShadcn,
  SelectTrigger as SelectTriggerShadcn,
  SelectValue as SelectValueShadcn,
} from './select-shadcn';

interface SelectProps extends SelectPropsRadix {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods?: UseFormReturn<any, any, any>;
  name: string;
  required?: boolean;
  label?: string;
  labelComponent?: React.ReactNode;
  labelSuffix?: string;
  containerClass?: ClassNameValue;
  labelClass?: ClassNameValue;
  labelSuffixClass?: ClassNameValue;
  id?: string;
  placeholder?: string;
  content?: SelectContentProps & { className?: string };
  triggerComponent?: SelectTriggerProps & { className?: string };
}

export const Select = memo(
  ({
    methods,
    containerClass,
    label,
    labelComponent,
    labelSuffix,
    labelClass,
    labelSuffixClass,
    ...props
  }: SelectProps) => {
    const errorMessage = methods?.formState.errors[props.name]?.message;
    return (
      <div className={cn('flex-col gap-2 flex-1 w-full flex', containerClass)} id="selectContainer">
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              'flex text-[#25262B] font-semibold text-xs items-center gap-1.5',
              labelClass,
            )}>
            {label} {labelComponent}
            {labelSuffix && (
              <span className={cn('text-xs text-gray-500', labelSuffixClass)}>{labelSuffix}</span>
            )}
          </label>
        )}
        {methods?.control ? (
          <Controller
            name={props.name}
            defaultValue={props.defaultValue}
            control={methods.control}
            render={({ field: { onChange, value } }) => (
              <>
                <SelectShadcn
                  {...props}
                  disabled={props.disabled}
                  value={value}
                  onValueChange={(e: string) => onChange(e)}
                  aria-label={label}>
                  <SelectTriggerShadcn
                    className={cn(
                      'border border-border text-sm py-2.5 px-3 !outline-none !ring-0',
                      {
                        'border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20':
                          errorMessage,
                      },
                      props.triggerComponent?.className,
                    )}>
                    <SelectValueShadcn
                      placeholder={<span className="text-gray-500">{props.placeholder}</span>}>
                      {value && (
                        <span className="text-black">
                          {React.Children.toArray(props.children)
                            .filter(
                              (child): child is React.ReactElement =>
                                React.isValidElement(child) &&
                                typeof child.props?.value !== 'undefined',
                            )
                            .find((child) => child.props.value === value)?.props.children || value}
                        </span>
                      )}
                    </SelectValueShadcn>
                  </SelectTriggerShadcn>
                  <SelectContentShadcn
                    className={cn('!rounded-xl bg-white', props.content?.className)}>
                    {props.children}
                  </SelectContentShadcn>
                </SelectShadcn>
              </>
            )}
          />
        ) : (
          <SelectShadcn {...props} aria-label={label}>
            <SelectTriggerShadcn
              className={cn(
                'border border-border bg-transparent text-black placeholder:text-[#DEE2E6] text-sm py-1 px-3 !outline-none !ring-0',
                props.triggerComponent?.className,
              )}>
              <SelectValueShadcn className="text-[#DEE2E6]" placeholder={props.placeholder} />
            </SelectTriggerShadcn>
            <SelectContentShadcn
              className={cn('!rounded-xl dark:bg-neutral-900 bg-white', props.content?.className)}>
              {props.children}
            </SelectContentShadcn>
          </SelectShadcn>
        )}
        {!!errorMessage && (
          <p className="text-red-500 dark:text-red-600 text-sm">
            <AlertCircle className="size-4 inline-block mr-1.5" />
            {errorMessage as string}
          </p>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps === nextProps,
);

export const SelectItem = memo(
  ({ className, ...props }: SelectItemProps & { className?: string }) => {
    return (
      <SelectItemShadcn
        className={cn(
          'cursor-pointer hover:!bg-neutral-50 !bg-white transition-all rounded-none first:rounded-t-xl data-[state=checked]:!bg-primary/15 data-[state=checked]:!text-primary data-[state=checked]:!rounded-md last:rounded-b-xl',
          className,
        )}
        {...props}
      />
    );
  },
  (prevProps, nextProps) => prevProps === nextProps,
);

Select.displayName = 'Select';
SelectItem.displayName = 'SelectItem';
