import clsx from "clsx";
import { FC, ReactNode } from "react";

interface SectionProps {
  className?: string;
  children?: ReactNode;
}

export const Section: FC<SectionProps> = ({ className, children }) => {
  const sectionClassName = clsx("w-full", className);
  return <section className={sectionClassName}>{children}</section>;
};
