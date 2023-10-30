import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading: React.FC<HeadingProps> = (props) => {
  if (props.variant === "h2") {
    return <h2 className={h2ClassName}>{props.children}</h2>;
  }

  if (props.variant === "h3") {
    return <h3 className={h3ClassName}>{props.children}</h3>;
  }

  if (props.variant === "h4") {
    return <h4 className={h4ClassName}>{props.children}</h4>;
  }

  if (props.variant === "h5") {
    return <h5 className={h5ClassName}>{props.children}</h5>;
  }

  if (props.variant === "h6") {
    return <h6 className={h6ClassName}>{props.children}</h6>;
  }

  return <h1 className={h1ClassName}>{props.children}</h1>;
};

const baseClassName = `textGradient font-bold text-center`;
const h1ClassName = `${baseClassName} text-4xl`;

const h2ClassName = baseClassName;
const h3ClassName = baseClassName;
const h4ClassName = baseClassName;
const h5ClassName = baseClassName;
const h6ClassName = baseClassName;
