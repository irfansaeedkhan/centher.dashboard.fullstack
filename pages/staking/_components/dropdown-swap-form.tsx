import React, { useRef, useState } from "react";
import Image from "next/image";
import { useOnClickOutside } from "usehooks-ts";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import clsx from "clsx";
import { SwapToken } from "@/models/swap";

export interface DropdownOption {
  title: string;
  value: SwapToken;
}

interface DropdownProps {
  placeholder?: string;
  options: DropdownOption[];
  selectedValue?: SwapToken;
  onSelect: (value: SwapToken) => void;
  error?: string;
}

const DropdownSwapForm: React.FC<DropdownProps> = ({
  placeholder,
  options,
  selectedValue,
  onSelect,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: DropdownOption) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const selectedLabel = selectedOption ? selectedOption.title : "";

  useOnClickOutside(ref, () => {
    setIsOpen(false);
  });

  return (
    <div
      ref={ref}
      className={clsx(
        "relative h-10 w-full rounded-3xl bg-black-shade-7 p-[1px]",
        isOpen ? "gradient-border-4" : "border border-black-shade-7"
      )}
    >
      <div
        className={clsx(
          `flex h-10 w-full cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-semibold text-white`,
          error && "border-red-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex w-full items-center justify-between gap-1.5">
          {selectedLabel ? (
            <Image
              src={`/images/${selectedValue?.icon}`}
              alt={"passport-banner"}
              height={100}
              width={100}
              className="h-5 w-5 flex-shrink-0 rounded-xl object-cover"
            />
          ) : null}{" "}
          <span className="text-sm font-medium">
            {selectedLabel || placeholder}{" "}
          </span>
          {/* Show selected label or placeholder */}
          {isOpen ? (
            <Image
              src="/images/arrow-up-gradient.svg"
              alt="arrow-up-gradient"
              width={24}
              height={24}
              className="h-6 w-6 flex-shrink-0"
            />
          ) : (
            <Image
              src="/images/arrow-down-gradient.svg"
              alt="arrow-down-gradient"
              width={24}
              height={24}
              className="h-6 w-6 flex-shrink-0"
            />
          )}
        </div>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-2xl border border-gray-shade-3 bg-black-shade-12 text-white shadow-lg">
          {options.map((option) => (
            <div
              key={option.value.address}
              className={`word-break cursor-pointer border-b border-gray-shade-3 px-4 py-2 first:rounded-t-2xl last:rounded-b-2xl last:border-none hover:bg-black-shade-9 ${
                option.value === selectedValue
                  ? "bg-black-shade-6 font-semibold"
                  : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSwapForm;
