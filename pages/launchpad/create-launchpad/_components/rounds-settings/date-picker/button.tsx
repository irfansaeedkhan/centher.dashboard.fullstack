import { FC, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  selectedSections?: "dates" | "months" | "years";
}

export const Button: FC<ButtonProps> = ({
  className,
  children,
  selectedSections,
  ...props
}) => {
  return (
    <button
      className={clsx(
        (className?.includes("bg-slate-700") ||
          className?.includes("border-slate-500")) &&
          "gradient-border-5 z-[10] flex rounded bg-transparent p-[0.5px]",
        "flex h-8 cursor-pointer items-center justify-center rounded text-white",
        selectedSections === "dates" ? "w-[52px]" : "w-auto",
        className
      )}
      {...props}
    >
      <span
        className={clsx(
          (className?.includes("bg-slate-700") ||
            className?.includes("border-slate-500")) &&
            "textGradient"
        )}
      >
        {children}
      </span>
    </button>
  );
};
