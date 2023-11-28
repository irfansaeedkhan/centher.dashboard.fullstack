import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import clsx from "clsx";
import { SwapToken } from "@/models/swap";
import Image from "next/image";

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
        "relative h-11 w-full rounded-3xl bg-black-shade-7 p-[1px]",
        isOpen ? "gradient-border-4" : "border border-black-shade-7"
      )}
    >
      <div
        className={clsx(
          `flex h-11 w-full cursor-pointer items-center justify-between rounded-lg px-4 text-sm font-semibold text-white`,
          error && "border-red-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex w-full items-center justify-between">
          {selectedLabel ? (
            <Image
              src={`/images/${selectedValue?.icon}`}
              alt={"passport-banner"}
              height={100}
              width={100}
              className="w-7 rounded-xl object-cover"
            />
          ) : null}{" "}
          {selectedLabel || placeholder}{" "}
          {/* Show selected label or placeholder */}
          {isOpen ? (
            <SlArrowUp className="h-2 w-2 fill-gray-400  fsm:h-3 fsm:w-3" />
          ) : (
            <SlArrowDown className="h-2 w-2 fill-gray-400 fsm:h-3 fsm:w-3" />
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-2xl border border-gray-shade-3 bg-black-shade-12 text-white shadow-lg">
          {options.map((option) => (
            <div
              key={option.value.id}
              className={`word-break cursor-pointer border-b border-gray-shade-3 px-4 py-2 first:rounded-t-2xl last:rounded-b-2xl last:border-none hover:bg-black-shade-9 ${
                option.value === selectedValue
                  ? "bg-black-shade-6 font-bold"
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
