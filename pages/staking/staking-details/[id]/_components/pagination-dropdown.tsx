import { ArrowDownGradient, ArrowUpGradient } from "@/assets/svgs";
import React, { useState } from "react";

const lockOptions = [
  { label: "1-10", value: "10" },
  {
    label: "20",
    value: "20",
  },
  {
    label: "30",
    value: "30",
  },
  {
    label: "40",
    value: "40",
  },
  {
    label: "50",
    value: "50",
  },
];

const PaginationDropdown: React.FC<{
  pageSize: string;
  setPageSize: (val: string) => void;
}> = ({ pageSize, setPageSize }) => {
  return (
    <CustomDropdown
      options={lockOptions}
      selectedValue={pageSize}
      onSelect={setPageSize}
    />
  );
};

export default PaginationDropdown;

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

const CustomDropdown: React.FC<DropdownProps> = ({
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
    <div className="relative ">
      <div
        className={`focus:border-ring-yellow-theme text-14px focus:!ring-yellow-theme active:!ring-yellow-theme h-10 w-full max-w-[100px] cursor-pointer rounded-lg border border-gray-shade-3 px-4 py-2 font-semibold text-white shadow-md focus:outline-none ${
          error ? "border-red-500" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="textGradient text-sm">{selectedLabel}</span>
          {isOpen ? <ArrowUpGradient /> : <ArrowDownGradient />}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-shade-3 bg-black-shade-3 text-white shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg px-4 py-2 hover:bg-black-shade-9 ${
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
