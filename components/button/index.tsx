import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: "v1" | "v2" | "v3" | "v4";
  Icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "v1",
  className,
  Icon,
  ...props
}) => {
  return (
    <button
      className={`
          ${variant === "v1" && "bg-brand-primary text-black-shade-3 "}
          ${variant === "v2" && "bg-black-shade-6 text-gray-shade-7 "}
          ${variant === "v3" && "bg-black-shade-7 text-gray-shade-8 "}
          ${variant === "v4" && "bg-black-shade-7 text-brand-primary "}
          text-14px  font-bold py-2 px-2 rounded-xl w-full 
          ${className && className}
          
          `}
      {...props}
    >
      {Icon && Icon}
      {title}
    </button>
  );
};

export default Button;
