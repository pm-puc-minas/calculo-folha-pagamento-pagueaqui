"use client";
import { cn } from "@/app/lib/utils";
import { AlertCircle } from "lucide-react";
import { memo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { ClassNameValue } from "tailwind-merge";
import { FileDropzone, FileDropzoneProps } from "./base-component";

interface FileInputProps extends FileDropzoneProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods?: UseFormReturn<any, any, any>;
  name: string;
  required?: boolean;
  label?: string;
  labelSuffix?: string;
  containerClass?: ClassNameValue;
  labelClass?: ClassNameValue;
  labelSuffixClass?: ClassNameValue;
  id?: string;
  placeholder?: string;
}

export const InputFile = memo(
  ({
    methods,
    containerClass,
    label,
    labelSuffix,
    labelClass,
    labelSuffixClass,
    ...props
  }: FileInputProps) => {
    const errorMessage = methods?.formState.errors[props.name]?.message;
    return (
      <div
        className={cn("flex-col gap-2 flex-1 w-full flex", containerClass)}
        id="selectContainer"
      >
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "flex text-[#25262B] font-medium text-sm items-center gap-1.5",
              labelClass
            )}
          >
            {label}
            {labelSuffix && (
              <span className={cn("text-xs text-gray-500", labelSuffixClass)}>
                {labelSuffix}
              </span>
            )}
          </label>
        )}
        {methods?.control ? (
          <Controller
            name={props.name}
            defaultValue={props.defaultValue}
            control={methods.control}
            disabled={props.disabled}
            render={({ field: { onChange, value, disabled } }) => (
              <>
                <FileDropzone
                  {...props}
                  disabled={disabled}
                  files={value}
                  onFileChange={(e) => onChange(e)}
                  aria-label={label}
                />
              </>
            )}
          />
        ) : (
          <FileDropzone {...props} aria-label={label} />
        )}
        {!!errorMessage && (
          <p className="text-red-500 dark:text-red-600 text-sm">
            <AlertCircle className="size-4 mr-1.5" />
            {errorMessage as string}
          </p>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps === nextProps
);
InputFile.displayName = "InputFile";
