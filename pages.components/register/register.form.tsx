// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// Current File's Components and Data
import { InputField } from "./input.field";
import { inputFields } from "./input.fields.data";
import { PasswordField } from "./password.field";

export const RegisterForm: React.FC = () => {
  return (
    <div className={wrapper}>
      {inputFields.slice(0, 4).map((inputField) => (
        <InputField key={inputField.name} {...inputField} />
      ))}

      <PasswordField label="Password" placeholder="Enter your password" />

      <PasswordField
        label="Confirm Password"
        placeholder="Enter your password again"
      />

      {inputFields.slice(4).map((inputField) => (
        <InputField key={inputField.name} {...inputField} />
      ))}

      <div>
        <button
          // onClick={handleLogin}
          className={Button}
        >
          Register
        </button>
      </div>
    </div>
  );
};

const wrapper = ctl(`
  flex 
  gap-6
  w-full 
  h-auto 
  flex-col 
`);

const Button = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg 
  dynamicTranss
  text-[#222531] 
  justify-center 
  bg-brand-primary 
`);
