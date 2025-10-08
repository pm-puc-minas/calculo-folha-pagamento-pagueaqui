import { cn } from "@/app/lib/utils";
import { BaseRadioProps } from "./type";

export function RadioBase({
  name,
  checked = false,
  disabled,
  id,
  onCheckedChange,
  classNames,
}: BaseRadioProps) {
  return (
    <>
      <label
        htmlFor={id}
        className={cn(
          "relative size-4 border-2 border-[#7c7d80] rounded-full shrink-0 flex items-center justify-center p-0.5 bg-transparent transition-colors",
          checked && "border-primary",
          disabled && "pointer-events-none opacity-70",
          classNames?.wrapper
        )}
      >
        <input
          type="radio"
          name={name}
          id={id}
          checked={checked}
          className="hidden"
          onChange={(e) => onCheckedChange?.(e.target.checked)}
        />
        <div
          className={cn(
            "size-full rounded-full shrink-0 bg-transparent transition-colors",
            checked && "bg-primary",
            classNames?.indicator
          )}
        />
      </label>
    </>
  );
}
