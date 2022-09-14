// React, Next, NPM Packages
import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import ctl from "@netlify/classnames-template-literals";
import { BsEye, BsEyeSlash } from "react-icons/bs";

// App imports
import { NoteLogin } from "@/components/note.login";
import { AppRoutes } from "@/constants/app.routes";
import { ErrorMessage } from "@/components/error.message";

const loginFormInitialValues = {
  email: "",
  password: "",
};

export const LoginForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: loginFormInitialValues,
    resolver: joiResolver(LoginFormSchema, {
      abortEarly: false,
      errors: {
        wrap: {
          label: "",
        },
      },
    }),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: typeof loginFormInitialValues) => {
    console.log(data);

    // TODO: Call NextJS API to login with next-auth
  };

  return (
    <form className={wrapper} onSubmit={handleSubmit(onSubmit)}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          className={!errors.email ? inputEmail : inputEmailError}
          {...register("email")}
        />
        {errors.email && <ErrorMessage message={errors.email.message} />}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Password</label>
        <div
          className={!errors.password ? wrapperPassword : wrapperPasswordError}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={inputPassword}
            {...register("password")}
          />
          {showPassword ? (
            <BsEyeSlash
              onClick={() => setShowPassword(false)}
              className={eyeSlash}
            />
          ) : (
            <BsEye onClick={() => setShowPassword(true)} className={eyeSlash} />
          )}
        </div>
        {errors.password && <ErrorMessage message={errors.password.message} />}
      </div>
      <NoteLogin
        title="If you are already memebr of Nethernft and don't have password, please click on forgot password to create new one for you."
        link={AppRoutes.forgot_password}
      />
      <div>
        <button className={button}>Login</button>
      </div>
    </form>
  );
};

// Login Form Schema
export const LoginFormSchema = Joi.object()
  .keys({
    email: Joi.string()
      .label("Email")
      .email({ tlds: false })
      .lowercase()
      .trim()
      .required(),
    password: Joi.string().label("Password").trim().required(),
  })
  .messages({
    "string.empty": `{#label} is required`,
  });

// Styles
const wrapper = ctl(`
  flex 
  gap-6
  w-full 
  h-auto 
  flex-col 
`);

const fieldWrapper = ctl(`
  flex 
  gap-2
  flex-col 
`);

const fieldTitle = ctl(`
  text-sm 
  text-white
`);

const inputEmail = ctl(`
  py-3 
  px-5 
  w-full 
  border-0 
  rounded-lg 
  text-white 
  bg-[#1E1E21] 
  focus:outline-none 
  focus:ring-brand-primary
`);

const inputEmailError = ctl(`
  ${inputEmail}
  focus:!ring-red-500
`);

const inputPassword = ctl(`
  p-0 
  w-full
  border-0 
  text-white 
  focus:ring-0 
  bg-transparent 
  focus:border-0 
  focus:outline-none 
`);

const wrapperPassword = ctl(`
  flex 
  py-3 
  px-5 
  gap-2 
  w-full 
  rounded-lg 
  text-white 
  bg-[#1E1E21] 
  items-center 
  justify-between 
  focus-within:ring-1
  focus-within:ring-brand-primary
`);

const wrapperPasswordError = ctl(`
  ${wrapperPassword}
  focus-within:!ring-red-500
`);

const eyeSlash = ctl(`
  cursor-pointer
  text-gray-shade-4
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
