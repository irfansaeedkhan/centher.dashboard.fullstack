// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { BsEye, BsEyeSlash } from "react-icons/bs";

// App imports
import { ErrorMessage } from "@/components/error.message";

// Current directory imports
import { PasswordFormProps } from "./password.form";

export const PasswordField = React.forwardRef<
  HTMLInputElement,
  PasswordFormProps
>(
  (
    {
      label,
      id,
      error,
      type, // must be there to prevent type change via props
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={fieldWrapper}>
        <label className={fieldTitle}>{label}</label>
        <div className={!error ? wrapperPassword : wrapperPasswordError}>
          <input
            type={showPassword ? "text" : "password"}
            id={id}
            className={inputPassword}
            {...props}
            ref={ref}
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

        {error && <ErrorMessage message={error.message} />}
      </div>
    );
  }
);

// Display name of the component for debugging
PasswordField.displayName = "PasswordField";

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

const wrapperPasswordError = ctl(`
  ${wrapperPassword}
  focus-within:!ring-red-500
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
