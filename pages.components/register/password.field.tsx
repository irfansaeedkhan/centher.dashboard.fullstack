// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  placeholder: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={fieldWrapper}>
      <label className={fieldTitle}>{label}</label>
      <div className={wrapperPassword}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={inputPassword}
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

const inputPassword = ctl(`
  p-0 
  w-full
  border-0 
  text-white 
  focus:ring-0 
  bg-transparent 
  focus:border-0 
  focus:outline-none 
`);

const wrapperPassword = ctl(`
  flex 
  py-3 
  px-5 
  gap-2 
  w-full 
  rounded-lg 
  text-white 
  bg-[#1E1E21] 
  items-center 
  justify-between 
`);

const EyeSlash = ctl(`
  cursor-pointer
  text-gray-shade-4
`);
