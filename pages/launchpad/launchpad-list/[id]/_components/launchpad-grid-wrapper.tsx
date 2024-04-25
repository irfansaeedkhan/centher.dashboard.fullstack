import React from "react";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  open: boolean;
}
export const LaunchpadGridWrapper: React.FC<Props> = ({ children, open }) => {
  return (
    <div
      className={clsx(
        "my-3 grid w-full transform grid-cols-1 gap-x-4 gap-y-6 overflow-hidden transition-all duration-1000 ease-in-out flg:grid-cols-2",
        open ? " pt-4 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      {children}
    </div>
  );
};
