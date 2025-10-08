import { Controller } from "react-hook-form";
import { RadioProps } from "./type";
import { RadioBase } from "./base";
import { cn } from "@/app/lib/utils";
import { AlertCircle } from "lucide-react";

export function Radio({ methods, name, ...props }: RadioProps) {
  const errorMessage = methods?.formState.errors[name]?.message;
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {methods ? (
            <Controller
              control={methods.control}
              name={name}
              defaultValue={props.checked}
              disabled={props.disabled}
              render={({ field: { name, onChange, value, disabled } }) => (
                <RadioBase
                  name={name}
                  checked={value}
                  disabled={disabled}
                  onCheckedChange={onChange}
                  classNames={props.classNames}
                  id={props.id}
                />
              )}
            />
          ) : (
            <RadioBase
              name={name}
              checked={props.checked}
              disabled={props.disabled}
              onCheckedChange={props.onCheckedChange}
              classNames={props.classNames}
              id={props.id}
            />
          )}
          {props.label && (
            <label
              htmlFor={props.id}
              className={cn(
                "flex-1 items-start text-start text-[#25262B] text-sm cursor-pointer",
                props.disabled && "pointer-events-none opacity-70",
                props.checked && "pointer-events-none",
                props.classNames?.label
              )}
            >
              {props.label}
            </label>
          )}
        </div>
        {!!errorMessage && (
          <p className="text-red-500 dark:text-red-600 text-sm">
            <AlertCircle className="size-4 mr-1.5" />
            {errorMessage as string}
          </p>
        )}
      </div>
    </>
  );
}
