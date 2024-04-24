import React from "react";
import clsx from "clsx";

interface Props {
  selectedValue: number | string;
  value: number | string;
  additionalValue?: string | number;
  handleClick: (value: number | string) => void;
}

export const RadioButtonComponent: React.FC<Props> = ({
  selectedValue,
  value,
  handleClick,
  additionalValue,
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
      <span className="flex text-xs uppercase text-white fxm:text-sm">
        <span>{value}</span>
        {additionalValue && (
          <span className="ml-0.5 text-[10px] fxm:text-sm">
            {additionalValue}
          </span>
        )}
        {additionalValue?.toString().includes("%") && (
          <span className="text-gradient ml-0.5 w-fit text-[10px] fxm:text-sm">
            (Recommended)
          </span>
        )}
      </span>
    </div>
  );
};
