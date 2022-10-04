// React, Next, NPM Packages
import Joi from "joi";
import { FieldError } from "react-hook-form";

export const formFields: FormFieldProps[] = [
  {
    id: "account_address",
    label: "Account Address",
    placeholder: "Enter your account address",
    type: "text",
    readOnly: true,
  },
  {
    id: "referred_by",
    label: (
      <>
        Referred by <span className="text-[#6B7280] text-xs"> (optional)</span>
      </>
    ),
    placeholder: "Enter referrer account address",
    type: "text",
    readOnly: true,
  },
];

// Signup State Schema
export const SignupStateSchema = Joi.object()
  .keys({
    account_address: Joi.string().label("Account Address").trim().required(),
    referred_by: Joi.string().label("Referred By").trim().allow("").optional(),
  })
  .messages({
    "string.empty": "{#label} is required",
    "any.invalid": "{#label} is invalid",
  });

// Types
export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: FieldName;
  label: React.ReactNode;
  placeholder: string;
  error?: FieldError;
}

export type FieldName = "account_address" | "referred_by";

export type SignupState = Record<FieldName, string>;
