import React, { useState, useEffect, useRef } from "react";

interface DropdownProps {
  options?: any;
}

const Dropdown: React.FC<DropdownProps> = ({ options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Select an option");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle item selection
  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Selected Item */}
      <button
        onClick={toggleDropdown}
        className="flex w-[412px] items-center justify-between gap-[16px] rounded-[8px] bg-[rgba(255,255,255,0.04)] px-[16px] py-[8px] text-[14px] font-medium leading-[24px] text-white shadow-sm focus:outline-none"
        tabIndex={0} // Set tabIndex for focusability
      >
        <span className="text-[14px] font-medium leading-[24px] text-[#A8ABBB]">
          {selected}
        </span>
        <svg
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Items */}
      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-[12px] bg-[#1B1C22] text-white shadow-lg">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-[24px] py-[16px] text-[14px] font-medium leading-[24px] text-[#A8ABBB] hover:bg-[#22242B]"
              tabIndex={0} // Set tabIndex for item focusability
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
