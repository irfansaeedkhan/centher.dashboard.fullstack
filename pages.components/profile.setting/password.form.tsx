// React, Next, NPM Packages
import Joi from "joi";
import { FieldError } from "react-hook-form";

export const PasswordForm: PasswordFormProps[] = [
  {
    id: "pseudonym",
    label: "Pseudonym",
    placeholder: "Enter your pseudonym",
  },
  {
    id: "first_name",
    label: "First Name",
    placeholder: "Enter your first name",
  },
  {
    id: "last_name",
    label: "Last Name",
    placeholder: "Enter your last name",
  },
  {
    id: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    id: "website",
    label: "Website",
    placeholder: "Enter your website",
  },
  {
    id: "old_password",
    label: "Old Password",
    placeholder: "Enter your old password",
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
];

// Password State Schema
export const PasswordStateSchema = Joi.object()
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
    password: Joi.string().label("Password").min(8).max(100).trim().required(),
    confirm_password: Joi.string()
      .label("Confirm Password")
      .trim()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
  })
  .messages({
    "string.empty": `{#label} is required`,
  });

// Types
export interface PasswordFormProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: FieldName;
  label: React.ReactNode;
  placeholder: string;
  error?: FieldError;
}

export type FieldName =
  | "website"
  | "email"
  | "last_name"
  | "first_name"
  | "pseudonym"
  | "old_password"
  | "password"
  | "confirm_password";

export type SignupState = Record<FieldName, string>;
