import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className=" min-h-screen  font-monto flex w-full">
      <div className="md:flex sm:hidden flex-col py-11 px-12 gap-10 bg-background-shade-1 w-1/2 ">
        <div className="w-fit">
          <Image
            src="/images/LogoLogin.svg"
            alt="logo"
            width={"166px"}
            height={"40px"}
          />
        </div>
        <div className="flex flex-col gap-16 items-center xl:px-32 lg:px-20 md:px-10">
          <div className="w-fit">
            <Image
              src="/images/LogoVertical.svg"
              alt="logo"
              width={"179px"}
              height={"308px"}
            />
          </div>
          <div className="flex flex-col gap-6 items-center">
            <div className="text-2xl font-semibold text-white">
              Login to Netheru
            </div>
            <div className="text-sm font-mediumn text-gray-shade-4 text-center">
              Login to your account with netheru to sell and buy NFTs on some
              easy steps.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 md:py-32 sm:py-10 xl:px-[113px] lg:px-20 sm:px-5 bg-black-shade-3 md:w-1/2 sm:w-full">
        <div className="sm:flex md:hidden flex-col gap-10 mb-5">
          <div className="w-fit">
            <Image
              src="/images/LogoLogin.svg"
              alt="logo"
              width={"166px"}
              height={"40px"}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold text-white">
              Login to Netheru
            </div>
            <div className="text-sm font-mediumn text-gray-shade-4">
              Login to your account with netheru to sell and buy NFTs on some
              easy steps.
            </div>
          </div>
        </div>
        <div className="flex gap-1 items-center text-sm font-medium justify-end">
          <span className="text-white">Not a member?</span>
          <span className="text-yellow-theme cursor-pointer dynamicTranss">
            <Link href="/register">Register now</Link>
          </span>
        </div>
        <div className="w-full h-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-white">Email Address</div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-[#1E1E21] rounded-lg w-full py-3 px-5 text-white border-0 focus:ring-yellow-theme focus:outline-none focus:border-yellow-theme"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-white">Password</div>
            <div className="bg-[#1E1E21] rounded-lg w-full py-3 px-5 text-white flex gap-2 items-center justify-between">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-transparent text-white border-0 focus:ring-0 focus:outline-none focus:border-0 p-0 w-full"
              />
              {showPassword ? (
                <BsEyeSlash
                  onClick={() => setShowPassword(false)}
                  className="cursor-pointer text-gray-shade-4"
                />
              ) : (
                <BsEye
                  onClick={() => setShowPassword(true)}
                  className="cursor-pointer text-gray-shade-4"
                />
              )}
            </div>
          </div>
          <div className="bg-gray-shade-6 py-3 px-4 flex flex-col gap-[6px] border border-gray-shade-5 rounded-lg">
            <div className="text-sm font-medium text-white">Note:</div>
            <div className="text-[11px] font-medium text-gray-shade-4">
              If you are already memebr of Nethernft and don’t have password,
              please click on forgot password to create new one for you.
            </div>
            <div className="text-xs font-medium text-white underline cursor-pointer hover:text-yellow-theme">
              <Link href="/forgotPassword">Forgot password</Link>
            </div>
          </div>
          <div>
            <button className="w-full py-3 flex justify-center rounded-lg font-bold bg-yellow-theme mt-2 text-[#222531] dynamicTranss">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
