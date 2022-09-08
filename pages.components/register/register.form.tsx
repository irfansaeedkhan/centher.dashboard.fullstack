// React, Next, NPM Packages
import React, { ChangeEvent, useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";

// App imports
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";

// Current directory imports
import { InputField } from "./input.field";
import { formFields, ErrorState, SignupState } from "./form.fields.data";
import { PasswordField } from "./password.field";

// Initial Error State
const initialErrorState: ErrorState = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  confirm_password: "",
};

// Initial Signup State
const initialSignupState: SignupState = {
  ...initialErrorState,
  password: "",
  profile_image: "avatar-1",
  account_address: "",
  referred_by: "",
};

export const RegisterForm: React.FC = () => {
  const { account } = useWeb3React();
  const { connectWallet } = useConnectWallet();

  const [signup, setSignup] = useState(initialSignupState);

  const [errors, setErrors] = useState(initialErrorState);

  useEffect(() => {
    (async () => {
      setSignup((prev) => {
        return {
          ...prev,
          account_address: account ?? "",
        };
      });
    })();
  }, [account]);

  useEffect(() => {
    if (
      signup.password !== "" &&
      signup.confirm_password !== "" &&
      signup.password !== signup.confirm_password
    ) {
      setErrors((prev) => {
        return {
          ...prev,
          confirm_password: "Passwords do not match",
        };
      });
      return;
    }

    setErrors((prev) => {
      return {
        ...prev,
        confirm_password: "",
      };
    });
  }, [signup.password, signup.confirm_password]);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignup((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={wrapper}>
      {formFields.slice(0, 4).map((formField) => {
        const value = signup[formField.name];
        return (
          <InputField
            key={formField.name}
            {...formField}
            value={value}
            onChange={handleValueChange}
          />
        );
      })}

      {formFields.slice(4, 6).map((formField) => {
        const value = signup[formField.name];
        const error = errors[formField.name as keyof ErrorState];
        return (
          <PasswordField
            key={formField.name}
            {...formField}
            value={value}
            onChange={handleValueChange}
            error={error}
          />
        );
      })}

      {formFields.slice(6).map((formField) => {
        if (
          formField.name === "account_address" &&
          signup.account_address === ""
        ) {
          return (
            <button
              key={formField.name}
              className={button}
              onClick={connectWallet}
            >
              Connect
            </button>
          );
        }

        const value = signup[formField.name as keyof typeof signup];

        return <InputField key={formField.name} {...formField} value={value} />;
      })}

      <div>
        <button className={button}>Register</button>
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

const button = ctl(`
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
