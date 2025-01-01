import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "@/assets/svgs";

interface DropdownProps {
  children: React.ReactNode;
  dropdownContent: (onSelect: (value: string) => void) => React.ReactNode;
  onSelect?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  dropdownContent,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const dropdownButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    if (onSelect) {
      onSelect(value);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (dropdownButtonRef.current) {
      const buttonRect = dropdownButtonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      setIsAbove(spaceBelow < spaceAbove);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target as Node) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target as Node)
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
    <div className="relative inline-block text-left">
      <button
        ref={dropdownButtonRef}
        onClick={toggleDropdown}
        tabIndex={0}
        className="inline-flex h-[38px] items-center justify-center gap-[8px] rounded-[1000px] bg-[#212228] px-[10px] py-[10px]"
      >
        {children}
        <ChevronDown />
      </button>

      {isOpen && (
        <div
          ref={dropdownMenuRef}
          className={`absolute right-0 z-50 mt-2 min-w-[300px] origin-top-right rounded-[16px] bg-[#141416] text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            isAbove ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {dropdownContent(handleSelect)}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
