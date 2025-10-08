import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DateArg,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  FormatOptions,
  subMonths,
  subYears,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: DateArg<Date> & {},
  formatStr: string,
  options?: FormatOptions
) {
  return format(date, formatStr, {
    ...options,
    locale: options?.locale || ptBR,
  });
}

export function formatAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();

  const years = differenceInYears(now, birth);
  const months = differenceInMonths(subYears(now, years), birth);
  const days = differenceInDays(subMonths(subYears(now, years), months), birth);

  return `${years} anos, ${months} meses e ${days} dias`;
}
