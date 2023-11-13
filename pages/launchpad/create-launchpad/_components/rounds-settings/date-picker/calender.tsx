import clsx from "clsx";
import { FC, ReactNode } from "react";

interface CalendarProps {
  className?: string;
  children?: ReactNode;
}

export const Calendar: FC<CalendarProps> = ({ className, children }) => {
  return (
    <main className={clsx("grid grid-cols-7 gap-y-2 px-4", className)}>
      {children}
    </main>
  );
};
