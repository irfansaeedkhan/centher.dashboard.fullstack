import { sortBy } from "@/models/nft";
import React from "react";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChange: (value: string) => void;
  openerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const SortByDropdown: React.FC<Props> = ({
  isOpen,
  onClose,
  onChange,
  openerRef,
}) => {
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
      className="absolute top-14 z-50 w-full rounded-lg bg-black-shade-12 "
    >
      <div className="flex flex-col items-start">
        {sortBy.map((item: any) => (
          <button
            className="px-4 py-3 text-sm font-medium text-white"
            key={item}
            onClick={() => {
              onChange(item);
              onClose();
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortByDropdown;
