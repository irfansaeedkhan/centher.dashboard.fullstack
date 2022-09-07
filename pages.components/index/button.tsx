import ctl from "@netlify/classnames-template-literals";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button className={buttonClassName}>{children}</button>;
};

const buttonClassName = ctl(`
  py-2
  px-4
  block
  w-max
  mx-auto
  rounded-lg
  font-bold
  text-yellow-300
  bg-black-shade-3
  mt-2
`);
