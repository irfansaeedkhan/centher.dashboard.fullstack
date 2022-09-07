import { NoteLogin } from "@/components/notelogin";
import { setUserAndJwt } from "@/store/slices/auth";
import ctl from "@netlify/classnames-template-literals";
import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useDispatch } from "react-redux";

export const LoginForm: React.FC<any> = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(
      setUserAndJwt({
        user: { _id: "123", email: "mhm13dev@gmail.com" },
        jwt: "some_token",
      })
    );
  };
  return (
    <div className={wrapper}>
      <div className={FieldWrapper}>
        <div className={FieldTitle}>Email Address</div>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          className={inputEmail}
        />
      </div>
      <div className={FieldWrapper}>
        <div className={FieldTitle}>Password</div>
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
      <NoteLogin
        title="If you are already memebr of Nethernft and don’t have password, please click on forgot password to create new one for you."
        link="forgot-password"
      />
      <div>
        <button onClick={handleLogin} className={Button}>
          Login
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
