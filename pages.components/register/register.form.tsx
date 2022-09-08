import ctl from "@netlify/classnames-template-literals";
import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={wrapper}>
      <div className={FieldWrapper}>
        <label className={FieldTitle}>Username</label>
        <input
          type="username"
          id="username"
          name="username"
          placeholder="Enter your username"
          className={inputEmail}
        />
      </div>
      <div className={FieldWrapper}>
        <label className={FieldTitle}>First Name</label>
        <input
          type="firstname"
          id="firstname"
          name="firstname"
          placeholder="Enter your first name"
          className={inputEmail}
        />
      </div>
      <div className={FieldWrapper}>
        <label className={FieldTitle}>Last Name</label>
        <input
          type="lastname"
          id="lastname"
          name="lastname"
          placeholder="Enter your last name"
          className={inputEmail}
        />
      </div>
      <div className={FieldWrapper}>
        <label className={FieldTitle}>Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          className={inputEmail}
        />
      </div>
      <div className={FieldWrapper}>
        <label className={FieldTitle}>Password</label>
        <div className={WrapperPassword}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={inputPassword}
          />
          {showPassword ? (
            <BsEyeSlash
              onClick={() => setShowPassword(false)}
              className={EyeSlash}
            />
          ) : (
            <BsEye onClick={() => setShowPassword(true)} className={EyeSlash} />
          )}
        </div>
      </div>
      <div className={FieldWrapper}>
        <label className={FieldTitle}>Confirm Password</label>
        <div className={WrapperPassword}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={inputPassword}
          />
          {showConfirmPassword ? (
            <BsEyeSlash
              onClick={() => setShowConfirmPassword(false)}
              className={EyeSlash}
            />
          ) : (
            <BsEye
              onClick={() => setShowConfirmPassword(true)}
              className={EyeSlash}
            />
          )}
        </div>
      </div>
      <div className={FieldWrapper}>
        <label className={FieldTitle}>Account Address</label>
        <input
          readOnly
          type="account"
          id="account"
          name="account"
          placeholder="Enter your account address"
          className={inputEmail}
        />
      </div>
      <div className={FieldWrapper}>
        <label className={FieldTitle}>
          Referred by{" "}
          <span className="text-[#6B7280] text-xs"> (optional)</span>
        </label>
        <input
          readOnly
          type="referred"
          id="referred"
          name="referred"
          placeholder="Enter your referred address"
          className={inputEmail}
        />
      </div>
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

const FieldWrapper = ctl(`
  flex 
  gap-2
  flex-col 
`);

const FieldTitle = ctl(`
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
  focus:border-brand-primary
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

const WrapperPassword = ctl(`
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
`);

const EyeSlash = ctl(`
  cursor-pointer
  text-gray-shade-4
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
