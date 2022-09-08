export const formFields: FormFieldProps[] = [
  {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
    type: "text",
  },

  {
    name: "first_name",
    label: "First Name",
    placeholder: "Enter your first name",
    type: "text",
  },
  {
    name: "last_name",
    label: "Last Name",
    placeholder: "Enter your last name",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
  },
  {
    name: "confirm_password",
    label: "Confirm Password",
    placeholder: "Enter your password again",
  },
  {
    name: "account_address",
    label: "Account Address",
    placeholder: "Enter your account address",
    type: "text",
    readOnly: true,
  },
  {
    name: "referred_by",
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

// Types
export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: FieldName;
  label: React.ReactNode;
  placeholder: string;
  error?: string;
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
