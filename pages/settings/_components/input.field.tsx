import React from "react";
import { FieldError } from "react-hook-form";
import clsx from "clsx";

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
  | "twitter_username"
  | "facebook_username"
  | "instagram_username"
  | "tiktok_username"
  | "twitch_username"
  | "onlyfans_username"
  | "youtube_url";

const fieldWrapper = `flex  gap-2 flex-col`;

const fieldTitle = `text-sm text-white`;

const inputField = `w-full py-3 px-5 bg-[#1E1E21] text-white rounded-lg border-0 focus:outline-none focus:ring-brand-primary text-sm font-medium leading-6`;

const inputFieldError = clsx(inputField, `focus:!ring-red-500`);
