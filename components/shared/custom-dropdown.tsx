import React, { useState } from "react";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";

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

const CustomDropdownAll: React.FC<DropdownProps> = ({
  options,
  selectedValue = "",
  onSelect,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: DropdownOption) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const selectedLabel = selectedOption ? selectedOption.label : "";

  return (
    <div className="relative">
      <div
        className={`w-full cursor-pointer rounded-lg border-0 bg-gray-shade-24 px-4 py-4 text-sm font-semibold text-white shadow-md focus:outline-none ${
          error ? "border-red-500" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className="word-break">{selectedLabel}</span>
          {isOpen ? (
            <SlArrowUp className="h-2 w-2 fill-gray-400  fsm:h-3 fsm:w-3" />
          ) : (
            <SlArrowDown className="h-2 w-2 fill-gray-400 fsm:h-3 fsm:w-3" />
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-shade-3 bg-black-shade-3 text-white shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`word-break cursor-pointer rounded-2xl px-4 py-2 hover:bg-black-shade-9 ${
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

export default CustomDropdownAll;
