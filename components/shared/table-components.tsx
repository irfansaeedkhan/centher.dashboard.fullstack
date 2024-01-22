import React, { HTMLAttributes } from "react";
import cn from "@/utils/cn";

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export const TableRow: React.FC<TableRowProps> = ({ className, ...props }) => {
  return (
    <tr
      className={cn(
        "max-w-full flex-grow border-b border-gray-shade-3 text-left text-sm text-white last:border-none odd:bg-black-shade-3 even:bg-black-shade-11",
        className
      )}
      {...props}
    />
  );
};

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  element: "td" | "th";
}

export const TableCell: React.FC<TableCellProps> = ({
  element,
  className,
  ...props
}) => {
  if (element === "th") {
    return (
      <th
        className={cn(
          "min-w-[200px] flex-shrink-0 px-8 py-4 font-semibold flg:py-7",
          className
        )}
        {...props}
      />
    );
  }
  return (
    <td
      className={cn(
        "min-w-[200px] flex-shrink-0 px-8 py-2 font-medium flg:py-5",
        className
      )}
      {...props}
    />
  );
};
