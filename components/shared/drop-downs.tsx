import React, { useRef, useState } from "react";
import clsx from "clsx";
import { useOnClickOutside } from "usehooks-ts";
import { ArrowDownGradient, ArrowUpGradient } from "@/assets/svgs";
import Link from "next/link";
import { useRouter } from "next/router";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  placeholder?: string;
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (label: string) => void;
  error?: string;
}

export const Dropdowns: React.FC<DropdownProps> = ({
  placeholder,
  options,
  selectedValue = "",
  onSelect,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { list_type } = router.query;

  const handleOptionClick = (option: DropdownOption) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  useOnClickOutside(ref, () => {
    setIsOpen(false);
  });

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const selectedLabel = selectedOption ? selectedOption.label : "";

  return (
    <div
      ref={ref}
      className={clsx(
        "relative h-9 w-full rounded-[10px]",
        isOpen ? "gradient-border-3 p-[1px]" : "border border-gray-shade-3"
      )}
    >
      <div
        className={clsx(
          "flex h-9 w-full flex-shrink-0 cursor-pointer items-center justify-between rounded-[10px] px-4 text-sm font-semibold text-white",
          error && "border-red-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex w-full items-center justify-between">
          {selectedValue === "" ? (
            <span>{placeholder}</span>
          ) : (
            <span>{selectedLabel}</span>
          )}
          {isOpen ? (
            <span className="flex flex-shrink-0">
              <ArrowUpGradient />
            </span>
          ) : (
            <span className="flex flex-shrink-0">
              <ArrowDownGradient />
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 flex w-full flex-col rounded-2xl border border-gray-shade-3 bg-black-shade-12 text-white shadow-lg">
          {options.map((option) => (
            <Link
              href={
                router.pathname +
                `?list_type=${list_type}&` +
                `sort=${option.value === "1" ? "asc" : "dsc"}`
              }
              key={option.value}
              className={clsx(
                "word-break cursor-pointer border-b border-gray-shade-3 px-4 py-2 first:rounded-t-2xl last:rounded-b-2xl last:border-none hover:bg-black-shade-9",
                option.value === selectedValue && "bg-black-shade-6 font-bold"
              )}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
