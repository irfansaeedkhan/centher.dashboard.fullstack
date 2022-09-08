// Current File's Components and Data
import { InputFieldProps } from "./input.field";

export const inputFields: InputFieldProps[] = [
  {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
  },

  {
    name: "firstname",
    label: "First Name",
    placeholder: "Enter your first name",
  },
  {
    name: "lastname",
    label: "Last Name",
    placeholder: "Enter your last name",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    name: "account",
    label: "Account Address",
    placeholder: "Enter your account address",
    readOnly: true,
  },
  {
    name: "referred",
    label: (
      <>
        Referred by <span className="text-[#6B7280] text-xs"> (optional)</span>
      </>
    ),
    placeholder: "Enter referrer account address",
    readOnly: true,
  },
];
