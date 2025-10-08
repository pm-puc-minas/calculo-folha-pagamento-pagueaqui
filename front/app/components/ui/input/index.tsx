'use client';

import type { Mask } from '@/app/types';
import { cn } from '@/app/lib/utils';
import type { ClassValue } from 'clsx';
import { AlertCircle, Eye } from 'lucide-react';
import { type ReactNode, useState, forwardRef } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { withMask } from 'use-mask-input';
import { EyeClosed } from '@phosphor-icons/react';

interface NumericFormatProps {
  onNumericValueChange?: (e: number | undefined) => void;
  decimalScale?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
  prefix?: string;
  suffix?: string;
  isAllowed?: (e: { floatValue: number }) => boolean;
}

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods?: UseFormReturn<any, any, any>;
  onValueChange?: (e: number | string) => void;
  isNumeric?: boolean;
  isPercentage?: boolean;
  name: string;
  label?: string;
  containerClass?: ClassValue;
  labelClass?: ClassValue;
  mask?: Mask;
  customMessage?: ReactNode;
  customMessageClass?: ClassValue;
  classNames?: {
    inputWrapper?: string;
    input?: string;
    label?: string;
    innerWrapper?: string;
  };
  labelPlacement?: 'inside' | 'outside' | 'outside-left';
  endContent?: ReactNode;
  isDisabled?: boolean;
  isRequired?: boolean;
}

export interface InputProps extends BaseInputProps, Partial<NumericFormatProps> {}

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelPlacement?: string;
  classNames?: {
    inputWrapper?: string;
    input?: string;
    label?: string;
    innerWrapper?: string;
  };
  endContent?: ReactNode;
  isDisabled?: boolean;
  isRequired?: boolean;
}>(({ label, labelPlacement, classNames, endContent, isDisabled, isRequired, className, type, ...props }, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="relative">
      {label && labelPlacement === 'outside' && (
        <label 
          htmlFor={inputId}
          className={cn(classNames?.label)}
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={cn("relative", classNames?.inputWrapper)}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          type={type as any}
          disabled={isDisabled || props.disabled}
          required={isRequired || props.required}
          className={cn(
            "w-full h-full bg-transparent outline-none",
            classNames?.input,
            className
          )}
        />
        {endContent && (
          <div className={cn("absolute right-0 top-1/2 transform -translate-y-1/2", classNames?.innerWrapper)}>
            {endContent}
          </div>
        )}
      </div>
    </div>
  );
});

CustomInput.displayName = 'CustomInput';

export const Input = ({
  containerClass,
  label,
  mask,
  isNumeric,
  isPercentage,
  methods,
  classNames,
  ...props
}: InputProps) => {
  props.isDisabled = props.disabled;
  props.isRequired = props.required;
  const [showPassword, setShowPassword] = useState(false);

  const classNamesUsed = {
    ...classNames,
    inputWrapper: cn(
      'w-full bg-white h-[2.375rem] border hover:!bg-[#343A4005] rounded-md px-4 py-2.5 transition-colors duration-300 focus-within:!border-primary focus-within:!bg-white',
      'hover:bg-neutral-100 focus-within:bg-white focus-within:hover:bg-white',
      {
        'border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20':
          methods?.formState?.errors[props.name]?.message,
      },
      classNames?.inputWrapper,
    ),
    input: cn(
      'text-[#25262B] placeholder:text-[#343A404D] caret-[#25262B]',
      {
        'text-destructive': methods?.formState?.errors[props.name]?.message,
      },
      classNames?.input,
    ),

    label: cn(
      'text-[#343A40] text-xs font-medium pb-0.5 mb-0',
      {
        'text-destructive': methods?.formState?.errors[props.name]?.message,
      },
      classNames?.label,
    ),
    innerWrapper: cn('ml-0 [&>svg]:size-5 text-[#9F9F9F]', classNames?.innerWrapper),
  };

  return (
    <div className={cn('flex flex-col flex-1 gap-1.5', containerClass)}>
      {methods?.control ? (
        <>
          <Controller
            control={methods.control}
            name={props.name}
            disabled={props.disabled}
            defaultValue={props.defaultValue}
            render={({ field: { name, onChange, value, disabled, onBlur } }) =>
              isNumeric ? (
                <NumericFormat
                  {...(props as any)}
                  type={
                    props.type === 'password' ? (showPassword ? 'text' : 'password') : (props.type as any)
                  }
                  customInput={CustomInput}
                  label={label}
                  onValueChange={(e) => {
                    if (isNumeric) {
                      onChange(e.floatValue);
                      if (methods.setValue) {
                        methods.setValue(name, e.floatValue);
                      }
                    }
                  }}
                  isAllowed={(e) => {
                    if (props.suffix === '%' || isPercentage) {
                      const notAllowed = e.floatValue && e.floatValue > 100;
                      if (notAllowed) {
                        if (props.onValueChange) {
                          props.onValueChange(100);
                        }
                      }
                      return !notAllowed;
                    }

                    if (props.isAllowed) {
                      return props.isAllowed({
                        floatValue: e.floatValue || 0,
                      });
                    }

                    return true;
                  }}
                  classNames={classNamesUsed}
                  labelPlacement="outside"
                  name={name}
                  value={value}
                  disabled={disabled}
                  onBlur={onBlur}
                  required={props.required}
                  endContent={
                    props.type === 'password' ? (
                      showPassword ? (
                        <EyeClosed
                          className="size-5 mx-2 cursor-pointer text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Ocultar senha"
                        />
                      ) : (
                        <Eye
                          className="size-5 mx-2 cursor-pointer text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Mostrar senha"
                        />
                      )
                    ) : (
                      props.endContent
                    )
                  }
                />
              ) : (
                <CustomInput
                  {...props}
                  className={props.className}
                  type={
                    props.type === 'password' ? (showPassword ? 'text' : 'password') : props.type
                  }
                  required={props.required}
                  label={label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange(e.target.value);
                  }}
                  classNames={classNamesUsed}
                  labelPlacement={'outside'}
                  name={name}
                  value={value}
                  disabled={disabled}
                  onBlur={onBlur}
                  endContent={
                    props.type === 'password' ? (
                      showPassword ? (
                        <EyeClosed
                          className="size-5 mx-2 cursor-pointer text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Ocultar senha"
                        />
                      ) : (
                        <Eye
                          className="size-5 mx-2 cursor-pointer text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Mostrar senha"
                        />
                      )
                    ) : (
                      props.endContent
                    )
                  }
                />
              )
            }
          />
        </>
      ) : (
        <>
          {isNumeric ? (
            <NumericFormat
              {...(props as any)}
              type={props.type === 'password' ? (showPassword ? 'text' : 'password') : (props.type as any)}
              customInput={CustomInput}
              labelPlacement="outside"
              classNames={classNamesUsed}
              label={label}
              isAllowed={(e) => {
                if (props.suffix === '%' || isPercentage) {
                  const notAllowed = e.floatValue && e.floatValue > 100;
                  if (notAllowed) {
                    if (props.onValueChange) {
                      props.onValueChange(100);
                    }
                  }
                  return !notAllowed;
                }

                if (props.isAllowed) {
                  return props.isAllowed({
                    floatValue: e.floatValue || 0,
                  });
                }

                return true;
              }}
              endContent={
                props.type === 'password' ? (
                  showPassword ? (
                    <EyeClosed
                      className="size-5 mx-2 cursor-pointer text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Ocultar senha"
                    />
                  ) : (
                    <Eye
                      className="size-5 mx-2 cursor-pointer text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Mostrar senha"
                    />
                  )
                ) : (
                  props.endContent
                )
              }
            />
          ) : (
            <CustomInput
              {...props}
              labelPlacement="outside"
              type={props.type === 'password' ? (showPassword ? 'text' : 'password') : props.type}
              classNames={classNamesUsed}
              label={label}
              endContent={
                props.type === 'password' ? (
                  showPassword ? (
                    <EyeClosed
                      className="size-5 mx-2 cursor-pointer text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Ocultar senha"
                    />
                  ) : (
                    <Eye
                      className="size-5 mx-2 cursor-pointer text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Mostrar senha"
                    />
                  )
                ) : (
                  props.endContent
                )
              }
            />
          )}
        </>
      )}
      {methods?.formState?.errors[props.name]?.message && (
        <p className="text-red-500 dark:text-red-600 text-sm items-center flex gap-2.5">
          <AlertCircle className="size-4 inline-block shrink-0" />
          {methods?.formState?.errors[props.name]?.message as string}
        </p>
      )}
      {props.customMessage && (
        <div className={cn('text-gray-600 text-sm', props.customMessageClass)}>
          {props.customMessage}
        </div>
      )}
    </div>
  );
};
Input.displayName = 'Input';
