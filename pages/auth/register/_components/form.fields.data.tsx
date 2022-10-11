// React, Next, NPM Packages
import { FieldError } from "react-hook-form";

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

export interface FeeModalState {
  isOpen: boolean;
  status: "start" | "progress" | "end";
  fee: string;
}
