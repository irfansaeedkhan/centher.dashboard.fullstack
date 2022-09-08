// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: React.ReactNode;
  placeholder: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  ...props
}) => {
  return (
    <div className={fieldWrapper}>
      <label className={fieldTitle}>{label}</label>
      <input
        type={name}
        id={name}
        name={name}
        placeholder={placeholder}
        className={inputField}
        {...props}
      />
    </div>
  );
};

const fieldWrapper = ctl(`
  flex 
  gap-2
  flex-col 
`);

const fieldTitle = ctl(`
  text-sm 
  text-white
`);

const inputField = ctl(`
  py-3 
  px-5 
  w-full 
  border-0 
  rounded-lg 
  text-white 
  bg-[#1E1E21] 
  focus:outline-none 
  focus:ring-brand-primary 
  focus:border-brand-primary
`);
