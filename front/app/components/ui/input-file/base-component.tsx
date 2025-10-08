"use client";
import { File, HandTap, Trash } from "@phosphor-icons/react";
import React, { useState } from "react";
import { Button } from "../button";
import { cn } from "@/app/lib/utils";

export interface FileDropzoneProps extends Partial<HTMLInputElement> {
  onFileChange?: (files: File[]) => void;
  defaultFiles?: File[];
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  defaultFiles,
  onFileChange,
  ...props
}) => {
  const [files, setFiles] = useState<File[]>(defaultFiles || []);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      if (onFileChange) {
        onFileChange(Array.from(e.dataTransfer.files));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      if (onFileChange) {
        onFileChange(Array.from(e.target.files));
      }
    }
  };

  if (files.length > 0) {
    return (
      <div className="border rounded-sm border-border p-4 space-y-4 divide-y-1 w-full flex-1">
        {files.map((file, index) => (
          <div className="flex items-center justify-between w-full" key={index}>
            <div className="flex truncate gap-2 items-center">
              <div className="shrink-0 bg-border rounded-sm size-8 flex items-center justify-center">
                <File className="size-4" />
              </div>
              <p className="text-sm text-[#343A40] font-medium truncate">
                {file.name}
              </p>
            </div>
            <Button
              variant={"ghost"}
              className="w-fit shrink-0"
              onClick={() => {
                const newFiles = [...files];
                newFiles.splice(index, 1);
                setFiles(newFiles);
                if (onFileChange) {
                  onFileChange(newFiles);
                }
              }}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <label htmlFor="fileInput">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "rounded-sm bg-primary/5 cursor-pointer border border-dashed border-primary p-3 min-h-[150px] w-full flex items-center justify-center gap-2",
          {
            "bg-neutral-100 text-neutra-600 pointer-events-none":
              props.disabled,
          }
        )}
      >
        <p className="text-sm text-primary text-balance font-medium">
          <HandTap className="size-4 inline shrink-0" />{" "}
          {isDragging
            ? "Solte os arquivos aqui"
            : "Clique ou arrasta seu arquivo aqui!"}
        </p>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          accept={props.accept}
          disabled={props.disabled}
          multiple={props.multiple}
          className={cn("sr-only")}
        />
      </div>
    </label>
  );
};
