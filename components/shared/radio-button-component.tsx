import React from "react";
import clsx from "clsx";

interface Props {
  selectedValue: number | string;
  value: number | string;
  handleClick: (value: number | string) => void;
}

export const RadioButtonComponent: React.FC<Props> = ({
  selectedValue,
  value,
  handleClick,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          "flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full p-[1px]",
          value === selectedValue
            ? "gradient-border-3"
            : "cursor-pointer border border-white"
        )}
        onClick={() => handleClick(value)}
      >
        {value === selectedValue && (
          <span className="background-gradient-color h-[10px] w-[10px] flex-shrink-0 rounded-full"></span>
        )}
      </div>
      <span className="text-sm uppercase text-white">
        {value}{" "}
        {value.toString().includes("%") && (
          <span className="text-gradient w-fit">(Recommended)</span>
        )}
      </span>
    </div>
  );
};
