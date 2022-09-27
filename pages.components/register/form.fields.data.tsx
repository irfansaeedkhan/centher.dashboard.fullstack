// React, Next, NPM Packages
import Joi from "joi";
import { FieldError } from "react-hook-form";

export const formFields: FormFieldProps[] = [
  {
    id: "pseudonym",
    label: "Pseudonym (optional)",
    placeholder: "Enter your pseudonym",
    type: "text",
  },
  {
    id: "first_name",
    label: "First Name",
    placeholder: "Enter your first name",
    type: "text",
  },
  {
    id: "last_name",
    label: "Last Name",
    placeholder: "Enter your last name",
    type: "text",
  },
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
    pseudonym: Joi.string()
      .label("Pseudonym")
      .allow("")
      .optional()
      .trim()
      .pattern(/^[ A-Za-z0-9_]+$/)
      .messages({
        "string.pattern.base":
          "Pseudonym should only contain alphabets numbers _ and space",
      }),
    first_name: Joi.string().label("First Name").trim().required(),
    last_name: Joi.string().label("Last Name").trim().required(),
    display_name: Joi.string()
      .label("Display Name")
      .trim()
      .valid("pseudonym", "real_name", "account_address")
      .required(),
    profile_image: Joi.string().label("Profile Image").trim().required(),
    account_address: Joi.string().label("Account Address").trim().required(),
    referred_by: Joi.string()
      .label("Referred By ID")
      .trim()
      .allow("")
      .optional(),
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

export type FieldName =
  | "pseudonym"
  | "first_name"
  | "last_name"
  | "display_name"
  | "profile_image"
  | "account_address"
  | "referred_by";

export type SignupState = Record<FieldName, string>;
