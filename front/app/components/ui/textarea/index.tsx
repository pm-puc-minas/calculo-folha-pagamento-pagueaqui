'use client';

import type { Mask } from '@/app/types';
import { cn } from '@/app/lib/utils';
import type { ClassValue } from 'clsx';
import { AlertCircle, Eye } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { withMask } from 'use-mask-input';
import { Textarea as NextUiInput, type TextAreaProps as NextUiInputProps } from '@nextui-org/input';
import { EyeClosed } from '@phosphor-icons/react';

interface NumericFormatProps {
  onValueChange: (e: number | undefined) => void;
  decimalScale?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
  prefix?: string;
  suffix?: string;
  isAllowed?: (e: { floatValue: number }) => boolean;
}

// @ts-expect-error 
export interface InputProps extends Partial<NextUiInputProps>, Partial<NumericFormatProps> {
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
  type?: 'text' | 'password' | 'tel';
  disabled?: boolean;
  required?: boolean;
  className?: string;
  endContent?: ReactNode;
  defaultValue?: string;
  classNames?: NextUiInputProps['classNames'];
}

export const Textarea = ({
  containerClass,
  label,
  mask,
  isNumeric,
  isPercentage,
  methods,
  classNames,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const classNamesUsed: Pick<NextUiInputProps, 'classNames'>['classNames'] = {
    ...classNames,
    inputWrapper: cn(
      'w-full bg-white h-12 rounded-md border border-border px-4 py-2.5 hover:!bg-[#343A4005] focus-within:!border-primary focus-within:!bg-white caret-black placeholder:text-red-500',
      {
        'border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20':
          methods?.formState?.errors[props.name]?.message,
      },
      classNames?.inputWrapper,
    ),
    input: cn('placeholder:text-[#343A404D] text-black', classNames?.input),
    label: cn(
      'text-[#343A40] text-xs font-medium pb-2 mb-0',
      {
        'text-destructive': methods?.formState?.errors[props.name]?.message,
      },
      classNames?.label,
    ),
    innerWrapper: cn(
      'ml-0 [&>svg]:size-5 text-border placeholder:text-[#343A404D]',
      classNames?.innerWrapper,
    ),
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
                  {...props}
                  type={
                    props.type === 'password' ? (showPassword ? 'text' : 'password') : props.type
                  }
                  customInput={NextUiInput}
                  getInputRef={
                    mask
                      ? withMask(mask, {
                          showMaskOnHover: false,
                          showMaskOnFocus: false,
                          autoUnmask: true,
                          clearMaskOnLostFocus: true,
                          removeMaskOnSubmit: true,
                        })
                      : undefined
                  }
                  label={label}
                  onValueChange={(e) => {
                    if (isNumeric) {
                      onChange(e.floatValue);
                      if (methods.setValue) {
                        methods.setValue(name, e.floatValue);
                      }
                    }
                    if (props.onValueChange) {
                      props.onValueChange(e.floatValue || 0);
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
                <NextUiInput
                  {...props}
                  className={props.className}
                  type={
                    props.type === 'password' ? (showPassword ? 'text' : 'password') : props.type
                  }
                  ref={
                    mask
                      ? withMask(mask, {
                          showMaskOnHover: false,
                          showMaskOnFocus: false,
                          autoUnmask: true,
                          clearMaskOnLostFocus: true,
                          removeMaskOnSubmit: true,
                        })
                      : undefined
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
              {...(({ onValueChange, ...rest }) => rest)(props)}
              type={props.type === 'password' ? (showPassword ? 'text' : 'password') : props.type}
              customInput={NextUiInput}
              getInputRef={
                mask
                  ? withMask(mask, {
                      showMaskOnHover: false,
                      showMaskOnFocus: false,
                      autoUnmask: true,
                      clearMaskOnLostFocus: true,
                      removeMaskOnSubmit: true,
                    })
                  : undefined
              }
              labelPlacement="outside"
              classNames={classNamesUsed}
              label={label}
              onValueChange={(e) => {
                if (props.onValueChange) {
                  props.onValueChange(e.floatValue || 0);
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
            <NextUiInput
              {...props}
              labelPlacement="outside"
              type={props.type === 'password' ? (showPassword ? 'text' : 'password') : props.type}
              classNames={classNamesUsed}
              ref={
                mask
                  ? withMask(mask, {
                      showMaskOnHover: false,
                      showMaskOnFocus: false,
                      autoUnmask: true,
                      clearMaskOnLostFocus: true,
                      removeMaskOnSubmit: true,
                    })
                  : undefined
              }
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
          <AlertCircle className="size-4 shrink-0" />
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
Textarea.displayName = 'Textarea';
