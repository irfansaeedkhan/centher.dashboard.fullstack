import React from "react";
import { useOnClickOutside } from "usehooks-ts";
import { categories } from "./dropdown.data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  openerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const CategoryDropdown: React.FC<Props> = ({ isOpen, onClose, openerRef }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, (e) => {
    if (openerRef.current?.contains(e.target as Node)) {
      return;
    }
    onClose();
  });

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-14 bg-black-shade-12 w-full rounded-lg z-50"
    >
      <div className="flex flex-col items-start">
        {categories.map((item) => (
          <button
            className="px-4 py-3 text-white text-sm font-medium"
            key={item}
            onClick={onClose}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
