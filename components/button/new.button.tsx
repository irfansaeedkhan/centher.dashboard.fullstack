import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?:
    | "v1"
    | "v2"
    | "v3"
    | "v4"
    | "v5"
    | "v6"
    | "v7"
    | "v8"
    | "v9"
    | "v10"
    | "v11"
    | "v12"
    | "v13";
  Icon?: React.ReactNode;
}

const NewButton: React.FC<ButtonProps> = ({
  title,
  variant = "v1",
  className,
  Icon,
  ...props
}) => {
  return (
    <button
      className={clsx(
        variant === "v1" && "bg-brand-primary text-black-shade-3",
        variant === "v2" && "bg-background-shade-2 text-gray-shade-7",
        variant === "v3" && "bg-black-shade-7 text-gray-shade-8",
        variant === "v4" && "bg-black-shade-7 text-brand-primary",
        variant === "v5" && "bg-gray-shade-20 text-[#E5E5FF80]/50",
        variant === "v6" && "bg-black-shade-6 text-gray-shade-7",
        variant === "v7" && "border border-danger bg-transparent text-danger",
        variant === "v8" && "bg-black-shade-3 text-gray-shade-7",
        variant === "v9" &&
          "border border-brand-primary bg-transparent text-brand-primary",
        variant === "v10" && "bg-gray-shade-3 text-gray-shade-8",
        `flex h-11 w-full items-center justify-center gap-3 rounded-lg py-[10px] px-2 text-sm font-semibold`,
        variant === "v11" &&
          "!h-[30px] !w-fit bg-[#76E268]/[0.16] !px-3 !py-1 !text-xs text-[#76E268]",
        variant === "v12" &&
          "!h-[30px] !w-fit bg-[#EA3943]/[0.16] !px-3 !py-1 !text-xs text-[#EA3943]",
        variant === "v13" &&
          "border border-gray-shade-3 bg-transparent text-white",
        className && className
      )}
      {...props}
    >
      {Icon && Icon}
      {title}
    </button>
  );
};

export default NewButton;
