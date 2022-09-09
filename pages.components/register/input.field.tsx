// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { ErrorMessage } from "@/components/error.message";

// Current directory imports
import { FormFieldProps } from "./form.fields.data";

export const InputField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, error, ...props }, ref) => {
    return (
      <div className={fieldWrapper}>
        <label className={fieldTitle}>{label}</label>
        <input
          id={id}
          className={!error ? inputField : inputFieldError}
          {...props}
          ref={ref}
        />
        {error && <ErrorMessage message={error.message} />}
      </div>
    );
  }
);

// Display name of the component for debugging
InputField.displayName = "InputField";

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

const inputFieldError = ctl(`
  ${inputField}
  focus:!ring-red-500
`);
