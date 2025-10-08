import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { type ClassValue } from "clsx";
import { AlertCircle, Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/app/lib/utils";
import { Controller, UseFormReturn } from "react-hook-form";

const CheckboxField = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer size-4 shrink-0 rounded-sm border-2 border-border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all duration-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
CheckboxField.displayName = "CheckboxField";

interface CheckboxProps {
  children?: React.ReactNode;
  containerClass?: ClassValue;
  labelClass?: ClassValue;
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  value?: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormReturn<any, any, any>['register'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formState?: UseFormReturn<any, any, any>['formState'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: UseFormReturn<any, any, any>['control'];
}

function Checkbox({
  register,
  formState,
  children,
  containerClass,
  labelClass,
  control,
  name,
  ...props
}: CheckboxProps) {
  let checkboxProps = {
    ...props,
    name,
  };

  if (register && name) {
    checkboxProps = {
      ...checkboxProps,
      ...register(name),
    };
  }
  return (
    <div className="space-y-2">
      <label
        htmlFor={props.id}
        className={cn(
          "flex items-center gap-1.5 cursor-pointer",
          {
            "pointer-events-none": props.disabled,
          },
          containerClass
        )}
      >
        {control && name ? (
          <Controller
            name={name}
            control={control}
            disabled={props.disabled}
            defaultValue={props.defaultChecked}
            render={({ field }) => (
              <CheckboxField
                ref={field.ref}
                checked={field.value}
                value={field.value}
                disabled={props.disabled}
                name={field.name}
                className={props.className}
                id={props.id}
                onCheckedChange={(e: boolean) => field.onChange(e)}
              />
            )}
          />
        ) : (
          <CheckboxField {...checkboxProps} />
        )}
        {children && (
          <p
            className={cn(
              "text-sm font-medium text-black dark:text-white",
              labelClass
            )}
          >
            {children}
          </p>
        )}
      </label>
      {formState && name && formState.errors[name]?.message && (
        <p className="text-red-500 dark:text-red-500 text-sm items-center flex gap-2.5">
          <AlertCircle className="size-4" />
          {formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}

Checkbox.displayName = "Checkbox";

export { Checkbox, CheckboxField };
