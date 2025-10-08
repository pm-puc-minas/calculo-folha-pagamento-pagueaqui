'use client';

import { cn } from '@/app/lib/utils';
import { CaretDown } from '@phosphor-icons/react';
import { Check, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '../input';

type Option = {
  value: string;
  label: string;
  [x: string]: string;
};

export type SelectWithSearchProps = {
  options: Option[];
  customChildren?: (value: Option, isSelected: boolean) => React.ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  classNames?: {
    trigger?: Extract<HTMLDivElement['className'], string>;
    placeholder?: Extract<HTMLDivElement['className'], string>;
    popoverWrapper?: Extract<HTMLDivElement['className'], string>;
    popoverOption?: Extract<HTMLDivElement['className'], string>;
  };
  customMarginHeight?: number;
};

export function SelectWithSearch(props: SelectWithSearchProps) {
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(props.options);
  const [isOpen, setIsOpen] = useState(false);
  const [positions, setPositions] = useState<
    | {
        x: number;
        y: number;
        width: number;
        height: number;
        top: number;
        right: number;
        bottom: number;
        left: number;
      }
    | undefined
  >(undefined);
  const ref = useRef<HTMLButtonElement>(null);

  function handleOpenClick() {
    if (isOpen) {
      setIsOpen(false);
      setPositions(undefined);
      return;
    }

    if (!ref.current) {
      setIsOpen(false);
      setPositions(undefined);
      return;
    }

    setIsOpen(true);
    setPositions(ref.current.getBoundingClientRect());
  }

  function handleSelect(option: Option) {
    setSelectedValue(option);
    if (props.onValueChange) {
      props.onValueChange(option.value);
    }
    setIsOpen(false);
    setPositions(undefined);
  }

  useEffect(() => {
    if (props.value) {
      const foundOption = props.options.find((option) => option.value === props.value);
      setSelectedValue(foundOption || null);
    }
  }, [props.value, props.options]);

  useEffect(() => {
    setFilteredOptions(props.options);
  }, [props.options]);

  return (
    <>
      <button
        type="button"
        id={props.id}
        onClick={(e) => {
          // @ts-expect-error exist this property in the target
          if (e.target?.id !== 'badge') {
            handleOpenClick();
          }
        }}
        ref={ref}
        disabled={props.disabled}
        className={cn(
          'border sticky py-2.5 px-3 text-sm z-50 flex items-center justify-start max-w-full gap-2 overflow-hidden text-start min-w-48 border-border p-2 rounded-md',
          props.classNames?.trigger,
        )}>
        <span className="flex-1 flex items-center gap-2">
          {selectedValue ? (
            <div className="bg-[#F8F9FA] w-fit flex items-center gap-1.5 py-1 px-1.5 rounded text-xs font-medium p-2">
              {selectedValue.label}
              <div
                className="!size-3 p-0 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedValue(null);
                  if (props.onValueChange) {
                    props.onValueChange('');
                  }
                }}
                id="badge">
                <X id="badge" className="size-2.5 text-foreground" />
              </div>
            </div>
          ) : (
            <p className="text-gray-600">{props.placeholder || 'Selecione...'}</p>
          )}
        </span>
        <CaretDown className="size-4" />
      </button>
      {positions && (
        <button
          type="button"
          className="absolute inset-0 bg-transparent z-30"
          onClick={handleOpenClick}
        />
      )}
      <div
        className={cn(
          'space-y-4 absolute bg-white rounded z-50 p-0 shadow-md h-0 overflow-hidden transition-all duration-300',
          props.classNames?.popoverWrapper,
          positions && `h-auto overflow-auto p-2`,
        )}
        style={{
          width: positions ? positions.width : undefined,
          marginTop: positions ? positions.height + (props.customMarginHeight || 4) : undefined,
        }}>
        <Input
          name="search"
          onChange={(e) => {
            setFilteredOptions(
              props.options.filter((option) =>
                option.label.toLowerCase().includes(e.target.value.toLowerCase()),
              ),
            );
          }}
          placeholder="Pesquisar..."
          endContent={<Search />}
        />
        <div className="space-y-2 max-h-[35dvh] overflow-auto">
          {filteredOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => {
                handleSelect(option);
              }}
              className={cn(
                'w-full flex items-center text-start transition-all duration-200 p-2 rounded-md',
                {
                  'bg-[#F1F0FF] text-primary': selectedValue?.value === option.value,
                },
                props.classNames?.popoverOption,
              )}>
              {props.customChildren ? (
                props.customChildren(option, selectedValue?.value === option.value)
              ) : (
                <>
                  {selectedValue?.value === option.value && <Check className="size-4 mr-2" />}
                  {option.label}
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
