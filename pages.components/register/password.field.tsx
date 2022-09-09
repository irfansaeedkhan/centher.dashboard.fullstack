// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { BsEye, BsEyeSlash } from "react-icons/bs";

// Current directory imports
import { FormFieldProps } from "./form.fields.data";

export const PasswordField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  type, // must be there to prevent type change via props
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={fieldWrapper}>
      <label className={fieldTitle}>{label}</label>
      <div className={wrapperPassword}>
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          className={inputPassword}
          {...props}
        />
        {showPassword ? (
          <BsEyeSlash
            onClick={() => setShowPassword(false)}
            className={EyeSlash}
          />
        ) : (
          <BsEye onClick={() => setShowPassword(true)} className={EyeSlash} />
        )}
      </div>

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

const wrapperPassword = ctl(`
  w-full 
  flex 
  items-center 
  justify-between 
  gap-2 
  py-3 
  px-5 
  bg-[#1E1E21] 
  text-white 
  rounded-lg 
  focus-within:ring-1
  focus-within:ring-brand-primary
`);

const inputPassword = ctl(`
  w-full
  p-0 
  bg-transparent 
  text-white 
  border-0
  focus:ring-0
  focus:outline-none
`);

const EyeSlash = ctl(`
  cursor-pointer
  text-gray-shade-4
`);
