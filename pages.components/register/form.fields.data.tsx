// React, Next, NPM Packages
import Joi from "joi";
import { FieldError } from "react-hook-form";

export const formFields: FormFieldProps[] = [
  {
    id: "username",
    label: "Username",
    placeholder: "Enter your username",
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
    id: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
  },
  {
    id: "password",
    label: "Password",
    placeholder: "Enter your password",
  },
  {
    id: "confirm_password",
    label: "Confirm Password",
    placeholder: "Enter your password again",
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
export const SignupStateSchema = Joi.object().keys({
  username: Joi.string().label("Username").required(),
  email: Joi.string().label("Email").email({ tlds: false }).required(),
  first_name: Joi.string().label("First Name").required(),
  last_name: Joi.string().label("Last Name").required(),
  password: Joi.string().label("Password").min(8).max(30).required(),
  confirm_password: Joi.string()
    .label("Confirm Password")
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
    }),
  profile_image: Joi.string().label("Profile Image"),
  account_address: Joi.string().label("Account Address").required(),
  referred_by: Joi.string().label("Referred By").allow(""),
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
  | "username"
  | "email"
  | "first_name"
  | "last_name"
  | "profile_image"
  | "password"
  | "confirm_password"
  | "account_address"
  | "referred_by";

export type ErrorName = Extract<
  FieldName,
  "username" | "email" | "first_name" | "last_name" | "confirm_password"
>;

export type SignupState = Record<FieldName, string>;

export type ErrorState = Record<ErrorName, string>;
