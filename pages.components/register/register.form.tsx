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
import { AppRoutes } from "@/constants/app.routes";
import { SpinIcon } from "@/assets/svgs";

// Initial Signup State
const initialSignupState: SignupState = {
  pseudonym: "",
  first_name: "",
  last_name: "",
  display_name: "pseudonym",
  profile_image: "/api/public/avatars/avatar-1.png",
  account_address: "",
  referred_by: "",
};

export const RegisterForm: React.FC = () => {
  // TODO: Waqar - Change the state name to isButtonDisabled to be more clear
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
    if (typeof router.query.referred_by === "string") {
      setValue("referred_by", router.query.referred_by);
    }
  }, [account, setValue, router.query.referred_by]);

  const onSubmit = async (signupData: SignupState) => {
    setIsButton(true);

    try {
      // Create a user with registration_pending state in database
      const { data } = await axiosNodeApi.post("/api/auth/signup", signupData);

      // Show success toast
      toast.success(
        data.message_description ??
          "Your account has been created successfully. Please login to continue.",
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
        {formFields.slice(0, 3).map((formField) => {
          return (
            <InputField
              key={formField.id}
              {...formField}
              {...register(formField.id)}
              error={errors[formField.id]}
            />
          );
        })}

        {/* Display Name Selector */}
        {/* TODO: Waqar Update it according to Design */}
        <div className="flex flex-col gap-2">
          <label className={"text-white text-sm"} htmlFor="display_name">
            Display Name
          </label>

          <select className={inputField} {...register("display_name")}>
            <option value="pseudonym">Pseudonym</option>
            <option value="real_name">Real Name</option>
            <option value="account_address">Account Address</option>
          </select>
        </div>

        {formFields.slice(3).map((formField) => {
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

const inputField = ctl(`
  w-full 
  py-3 
  px-5 
  bg-[#1E1E21] 
  text-white 
  rounded-lg
  border-0
  focus:outline-none 
  focus:ring-brand-primary
`);
