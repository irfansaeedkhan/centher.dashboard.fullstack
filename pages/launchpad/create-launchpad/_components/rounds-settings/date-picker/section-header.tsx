import clsx from "clsx";
import { FC, ReactNode } from "react";

interface SectionHeaderProps {
  className?: string;
  children?: ReactNode;
}

export const SectionHeader: FC<SectionHeaderProps> = ({
  className,
  children,
}) => {
  return (
    <header
      className={clsx(
        "mb-2 flex items-center justify-between border-b border-gray-shade-3 px-4 pb-2 pt-4",
        className
      )}
    >
      {children}
    </header>
  );
};
