// React, Next, NPM Packages
import React from "react";
import { FieldError } from "react-hook-form";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { ErrorMessage } from "@/components/error.message";

export const InputField = React.forwardRef<HTMLInputElement, PasswordFormProps>(
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

export interface PasswordFormProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: FieldName;
  label: React.ReactNode;
  placeholder: string;
  error?: FieldError;
}

export type FieldName =
  | "pseudonym"
  | "first_name"
  | "last_name"
  | "website_url"
  | "twitter_username";

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
