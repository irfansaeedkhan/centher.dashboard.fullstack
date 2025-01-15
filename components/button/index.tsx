import React from "react";
import cn from "@/utils/cn";
import styles from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: "primary" | "secondary" | "danger";
  Icon?: React.ReactNode;
  IconEnd?: React.ReactNode;
  borderRounded?: string;
  backgroundColor?: string;
  loaderIcon?: React.ReactNode;
  important?: boolean;
}
interface CustomCSSProperties extends React.CSSProperties {
  "--border-rounded": string;
  "--background-color": string;
}
const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  className,
  Icon,
  IconEnd,
  loaderIcon,
  borderRounded = "14px",
  backgroundColor = "#17171A",
  important = false,
  ...props
}) => {
  const customStyles: CustomCSSProperties = {
    "--border-rounded": borderRounded,
    "--background-color": backgroundColor,
  };

  return (
    <button
      className={cn(
        "relative flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold transition duration-100 ease-in-out",
        variant === "primary" && styles["primary-gradient-btn"],
        variant === "secondary" &&
          "border border-[#1E202B] bg-transparent font-semibold hover:bg-[#1E202B]",
        variant === "danger" &&
          "border border-[#FF424D] bg-transparent font-semibold text-[#FF424D] hover:border-transparent hover:bg-[#FF424D] hover:text-white",
        `${props.disabled && "pointer-events-none opacity-50"}`,
        className && className
      )}
      style={variant === "primary" ? customStyles : undefined}
      {...props}
      disabled={props.disabled}
    >
      {Icon && Icon}
      <span
        className={cn(
          "primary-gradient-btn-text relative",
          variant === "primary" && "primary-btn-text-gradient",
          variant === "secondary" && "text-white"
        )}
      >
        {loaderIcon ? loaderIcon : title}
      </span>
      {IconEnd && IconEnd}
      {important && variant !== "danger" && (
        <span
          className={cn(
            `text-gradient absolute -right-1 -top-1 h-5 w-5 text-xl`
          )}
        >
          *
        </span>
      )}
    </button>
  );
};

export default Button;
