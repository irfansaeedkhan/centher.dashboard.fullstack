import React from "react";
import clsx from "clsx";
import styles from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: "primary" | "secondary" | "danger";
  Icon?: React.ReactNode;
  borderRounded?: string;
  backgroundColor?: string;
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
        ` default-button-styling`,
        variant === "primary" &&
          `primary-gradient-btn relative bg-gradient-pattern hover:before:bg-transparent`,
        variant === "secondary" &&
          "border border-[#1E202B] bg-transparent font-semibold text-white hover:border-transparent hover:bg-[#1E202B]",
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
      <span className="primary-gradient-btn-text relative">{title}</span>
    </button>
  );
};

export default FinalButton;
