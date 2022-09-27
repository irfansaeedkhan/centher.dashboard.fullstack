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
import Avatars from "@/components/avatars";
import { axiosNodeApi } from "@/utils/axios";

// Current directory imports
import { InputField } from "./input.field";
import { formFields, SignupState, SignupStateSchema } from "./form.fields.data";
import { PasswordField } from "./password.field";
import { AppRoutes } from "@/constants/app.routes";
import { SpinIcon } from "@/assets/svgs";

// Initial Signup State
const initialSignupState: SignupState = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  confirm_password: "",
  profile_image: "/api/public/avatars/avatar-1.png",
  account_address: "",
  referred_by: "",
};

export const RegisterForm: React.FC = () => {
  const [isButton, setIsButton] = useState(false);
  const router = useRouter();
  const { account } = useWeb3React();
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
    setIsButton(true);
    try {
      // Create a user with registration_pending state in database
      const { data } = await axiosNodeApi.post("/api/auth/signup", signupData);

      // Show success toast
      toast.success(
        data.message_description ??
          "An email has been sent to your email address. Please verify your email address before login.",
        {
          duration: 8000,
        }
      );

      setIsButton(false);
      // Redirect to login page
      router.push(AppRoutes.auth.login);
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
      setIsButton(false);
    }
  };

  return (
    <>
      <Avatars
        defaultAvatar={initialSignupState.profile_image}
        onSelect={(avatar) => setValue("profile_image", avatar)}
      />

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
