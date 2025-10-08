import { UseFormReturn } from "react-hook-form";

export type BaseRadioProps = {
  name: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  classNames?: BaseClassNames;
};

export type BaseClassNames = {
  wrapper?: string;
  indicator?: string;
};

export type RadioProps = {
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods?: UseFormReturn<any, unknown, undefined>;
  classNames?: BaseClassNames & {
    label: string;
  };
} & BaseRadioProps;
