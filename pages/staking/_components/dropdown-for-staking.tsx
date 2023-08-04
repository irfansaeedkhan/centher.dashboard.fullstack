import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import clsx from "clsx";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (label: string) => void;
  error?: string;
}

const StakingDropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue = "",
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

  const selectedLabel = selectedOption ? selectedOption.label : "";

  useOnClickOutside(ref, () => {
    setIsOpen(false);
  });

  return (
    <div
      ref={ref}
      className={clsx(
        "relative h-9 w-full rounded-lg p-[1px]",
        isOpen ? "gradient-border-4" : "border border-gray-shade-3"
      )}
    >
      <div
        className={clsx(
          `text-14px flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-4 font-semibold text-white`,
          error && "border-red-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex w-full items-center justify-between">
          <span>{selectedLabel}</span>
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
              key={option.value}
              className={`word-break cursor-pointer border-b border-gray-shade-3 px-4 py-2 first:rounded-t-2xl last:rounded-b-2xl last:border-none hover:bg-black-shade-9 ${
                option.value === selectedValue
                  ? "bg-black-shade-9 font-bold"
                  : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StakingDropdown;
