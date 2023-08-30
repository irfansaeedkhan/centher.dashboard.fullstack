import clsx from "clsx";
import React from "react";
import styles from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: "primary" | "secondary" | "danger";
  Icon?: React.ReactNode;
  borderRounded?: string;
  backgroundColor?: string;
  loaderIcon?: React.ReactNode;
}
interface CustomCSSProperties extends React.CSSProperties {
  "--border-rounded": string;
  "--background-color": string;
}
const FinalButton: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  className,
  Icon,
  loaderIcon,
  borderRounded = "14px",
  backgroundColor = "#17171A",
  ...props
}) => {
  const customStyles: CustomCSSProperties = {
    "--border-rounded": borderRounded,
    "--background-color": backgroundColor,
  };
  return (
    <button
      className={clsx(
        `default-button-styling flex items-center justify-center gap-2`,
        variant === "primary" &&
          `primary-gradient-btn relative bg-gradient-pattern`,
        variant === "primary" && !props.disabled && "hover:scale-105",
        variant === "primary" && props.disabled && "hover:scale-100",
        variant === "secondary" &&
          "border border-[#1E202B] bg-transparent font-semibold text-white ",
        variant === "secondary" &&
          !props.disabled &&
          "hover:border-transparent hover:bg-[#1E202B]",
        variant === "danger" &&
          "border border-[#FF424D] bg-transparent font-semibold text-[#FF424D] hover:border-transparent hover:bg-[#FF424D] hover:text-white",
        `${props.disabled && "opacity-50"}`,
        className && className,
        variant === "primary" && styles["primary-gradient-btn"]
      )}
      style={variant === "primary" ? customStyles : undefined}
      {...props}
    >
      {Icon && Icon}
      <span className="primary-gradient-btn-text relative">
        {loaderIcon ? loaderIcon : title}
      </span>
    </button>
  );
};

export default FinalButton;
