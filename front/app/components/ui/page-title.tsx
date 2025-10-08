import { cn } from "@/app/lib/utils";
import { ElementType, PropsWithChildren, ReactNode } from "react";
import type { ClassNameValue } from "tailwind-merge";

export interface PageTitleProps {
  title: ReactNode;
  classNames?: {
    innerWrapperClass?: ClassNameValue;
    mainWrapperClass?: ClassNameValue;
  };
  icon?: ElementType;
  description?: string;
  descriptionInTheSameLineOfTitle?: boolean;
}

export function PageTitle({
  icon: Icon,
  title,
  description,
  descriptionInTheSameLineOfTitle,
  classNames,
  children,
}: PageTitleProps & PropsWithChildren) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
        <div
          className={cn(
            "flex items-center gap-3",
            classNames?.mainWrapperClass
          )}
        >
          {Icon && (
            <div className="size-[56px] rounded-full flex items-center justify-center shrink-0 bg-[#F8F9FA]">
              <Icon className="size-6 text-[#343A40]" />
            </div>
          )}
          <div
            className={cn(
              "flex flex-col justify-center gap-1.5 text-start",
              classNames?.innerWrapperClass,
              {
                "flex-row justify-start items-center":
                  descriptionInTheSameLineOfTitle,
              }
            )}
          >
            <h4 className="text-lg sm:text-xl font-medium text-[#343A40]">
              {title}
            </h4>
            {description && (
              <p className="text-base first-letter:uppercase font-medium text-[#909296] ">
                {description}
              </p>
            )}
          </div>
        </div>
        {children && <div className="flex gap-4 items-center">{children}</div>}
      </div>
    </>
  );
}
