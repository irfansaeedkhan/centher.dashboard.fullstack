import React from "react";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  open: boolean;
}
export const GridWrapper: React.FC<Props> = ({ children, open }) => {
  return (
    <div
      className={clsx(
        "my-3 grid w-full grid-cols-1 gap-x-4 gap-y-6 flg:grid-cols-2",
        open ? " pt-4 opacity-100" : "max-h-0 opacity-0"
      )}
      style={{
        transition: "opacity 0.5s ease-in-out, max-height 0.5s ease-in-out",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
