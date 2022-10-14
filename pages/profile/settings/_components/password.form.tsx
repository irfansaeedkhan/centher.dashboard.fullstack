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
