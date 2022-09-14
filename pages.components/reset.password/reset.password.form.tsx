// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { BsEye, BsEyeSlash } from "react-icons/bs";

export const ResetForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className={wrapper}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Password</label>
        <div className={wrapperPassword}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={inputPassword}
            // {...props}
            // ref={ref}
            placeholder="Password"
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
        <span className={fieldInstruction}>Minimum 8 characters</span>
        {/* {error && <ErrorMessage message={error.message} />} */}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Confirm Password</label>
        <div className={wrapperPassword}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmpassword"
            className={inputPassword}
            // {...props}
            // ref={ref}
            placeholder="Confirm password"
          />
          {showConfirmPassword ? (
            <BsEyeSlash
              onClick={() => setShowConfirmPassword(false)}
              className={eyeSlash}
            />
          ) : (
            <BsEye
              onClick={() => setShowConfirmPassword(true)}
              className={eyeSlash}
            />
          )}
        </div>
        <span className={fieldInstruction}>Both password must match.</span>
        {/* {error && <ErrorMessage message={error.message} />} */}
      </div>
      <div>
        <button className={button}>Reset password</button>
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

const fieldWrapper = ctl(`
  flex 
  gap-2
  flex-col 
`);

const fieldTitle = ctl(`
  text-sm 
  text-white
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
  w-full 
  flex 
  items-center 
  justify-between 
  gap-2 
  py-3 
  px-5 
  bg-[#1E1E21] 
  text-white 
  rounded-lg 
  focus-within:ring-1
  focus-within:ring-brand-primary
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

const fieldInstruction = ctl(`
  text-sm
  text-[#5B5E66]
`);
