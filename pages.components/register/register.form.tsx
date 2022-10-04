// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { toast } from "react-hot-toast";

// App imports
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { ErrorMessage } from "@/components/error.message";
import { AppRoutes } from "@/constants/app.routes";
import { SpinIcon } from "@/assets/svgs";

// Current directory imports
import { InputField } from "./input.field";
import { formFields, SignupState, SignupStateSchema } from "./form.fields.data";
import { registerWithSmartContract } from "./register.with.smart.contract";

// Initial Signup State
const initialSignupState: SignupState = {
  account_address: "",
  referred_by: "",
};

export const RegisterForm: React.FC = () => {
  // TODO: Waqar - Change the state name to isButtonDisabled to be more clear
  const [isButton, setIsButton] = useState(false);
  const router = useRouter();
  const { account, library } = useWeb3React();
  const { connectWallet } = useConnectWallet();

  const { handleSubmit, setValue, control } = useForm({
    defaultValues: initialSignupState,
    resolver: joiResolver(SignupStateSchema, {
      abortEarly: false,
      errors: {
        wrap: {
          label: "",
        },
      },
    }),
  });

  useEffect(() => {
    setValue("account_address", account ?? "", {
      shouldValidate: account != null,
    });
    if (typeof router.query.referred_by === "string") {
      setValue("referred_by", router.query.referred_by);
    }
  }, [account, setValue, router.query.referred_by]);

  const onSubmit = async (signupData: SignupState) => {
    setIsButton(true);

    const res = await registerWithSmartContract(library, signupData);

    if (res.status === "error") {
      setIsButton(false);
      toast.error(res.message_description || "Something went wrong");
      return;
    }

    toast.success(res.message_description);

    // Redirect to login page
    router.push(AppRoutes.auth.login);
  };

  return (
    <>
      <form className={wrapper} onSubmit={handleSubmit(onSubmit)}>
        {formFields.map((formField) => {
          return (
            <Controller
              key={formField.id}
              name={formField.id}
              control={control}
              render={({ field, fieldState: { error } }) => {
                if (field.name === "account_address" && field.value === "") {
                  return (
                    <div>
                      <button
                        key={formField.id}
                        className={connectButton}
                        type="button"
                        onClick={connectWallet}
                      >
                        Connect
                      </button>
                      {error && (
                        <ErrorMessage
                          message={error.message}
                          className="mt-2"
                        />
                      )}
                    </div>
                  );
                }

                return <InputField {...formField} {...field} error={error} />;
              }}
            />
          );
        })}

        <div>
          {isButton ? (
            <button type="button" className={button} disabled>
              <SpinIcon />
              Processing...
            </button>
          ) : (
            <button type="submit" className={button}>
              Register
            </button>
          )}
        </div>
      </form>
    </>
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
  items-center 
  text-gray-shade-5
  justify-center 
  bg-brand-primary 
  hover:bg-brand-primary-dark
  transition-all 
`);

const connectButton = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg
  items-center 
  justify-center 
  text-brand-primary
  bg-black-shade-7
  hover:bg-black-shade-4
  transition-all 
`);
