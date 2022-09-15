// React, Next, NPM Packages
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { toast } from "react-toastify";

// App imports
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { ErrorMessage } from "@/components/error.message";
import Avatars from "@/components/avatars";
import { axiosNodeApi } from "@/utils/axios";

// Current directory imports
import { InputField } from "./input.field";
import { formFields, SignupState, SignupStateSchema } from "./form.fields.data";
import { PasswordField } from "./password.field";
import { deductRegistrationFee } from "./deduct.registration.fee";

// Initial Signup State
const initialSignupState: SignupState = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  confirm_password: "",
  profile_image: "avatar-1",
  account_address: "",
  referred_by: "",
};

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { account, library } = useWeb3React();
  const { connectWallet } = useConnectWallet();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
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
    if (typeof router.query.referrer === "string") {
      setValue("referred_by", router.query.referrer);
    }
  }, [account, setValue, router.query.referrer]);

  const onSubmit = async (signupData: SignupState) => {
    // TODO: Add loading state to the submit button and disable it

    try {
      // Create a user with registration_pending state in database
      await axiosNodeApi.post("/api/auth/signup", signupData);
      // Redirect to login page
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message_description || "Something went wrong"
      );
    }
  };

  return (
    <>
      <Avatars />

      <form className={wrapper} onSubmit={handleSubmit(onSubmit)}>
        {formFields.slice(0, 4).map((formField) => {
          return (
            <InputField
              key={formField.id}
              {...formField}
              {...register(formField.id)}
              error={errors[formField.id]}
            />
          );
        })}

        {formFields.slice(4, 6).map((formField) => {
          return (
            <PasswordField
              key={formField.id}
              {...formField}
              {...register(formField.id)}
              error={errors[formField.id]}
            />
          );
        })}

        {formFields.slice(6).map((formField) => {
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
                        className={button}
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
          <button type="submit" className={button}>
            Register
          </button>
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
  dynamicTranss
  text-gray-shade-5 
  justify-center 
  bg-brand-primary 
`);
