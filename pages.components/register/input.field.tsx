// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports
import { FormFieldProps } from "./form.fields.data";

export const InputField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  ...props
}) => {
  return (
    <div className={fieldWrapper}>
      <label className={fieldTitle}>{label}</label>
      <input id={name} name={name} className={inputField} {...props} />

      {error && <p className="text-red-500">{error}</p>}
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
  w-full 
  py-3 
  px-5 
  bg-[#1E1E21] 
  text-white 
  rounded-lg
  border-0
  focus:outline-none 
  focus:ring-brand-primary
`);
