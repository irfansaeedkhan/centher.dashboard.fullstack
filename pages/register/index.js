import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Avatars from "../../components/Register/Avatars";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
              Register to Netheru
            </div>
            <div className="text-sm font-mediumn text-gray-shade-4 text-center">
              Register your account with netheru to sell and buy NFTs on some
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
              Register to Netheru
            </div>
            <div className="text-sm font-mediumn text-gray-shade-4">
              Register your account with netheru to sell and buy NFTs on some
              easy steps.
            </div>
          </div>
        </div>
        <div className="flex gap-1 items-center text-sm font-medium justify-end">
          <span className="text-white">Already a member?</span>
          <span className="text-yellow-theme cursor-pointer dynamicTranss">
            <Link href="/login">Login in now</Link>
          </span>
        </div>
        <div className="w-full h-auto flex flex-col gap-6">
          {/* <Avatars /> */}
          <div className="flex flex-col gap-2 ">
            <div className="text-sm text-white">Username</div>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="bg-[#1E1E21] rounded-lg w-full py-3 px-5 text-white border-0 focus:ring-yellow-theme focus:outline-none focus:border-yellow-theme"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-white">First Name</div>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Enter your first name"
              className="bg-[#1E1E21] rounded-lg w-full py-3 px-5 text-white border-0 focus:ring-yellow-theme focus:outline-none focus:border-yellow-theme"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-white">Last Name</div>
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Enter your lastname"
              className="bg-[#1E1E21] rounded-lg w-full py-3 px-5 text-white border-0 focus:ring-yellow-theme focus:outline-none focus:border-yellow-theme"
            />
          </div>
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
            <div className="text-sm text-white">Account Address</div>
            <input
              type="text"
              id="accountaddress"
              name="accountaddress"
              placeholder="Enter your account address"
              className="bg-[#1E1E21] rounded-lg w-full py-3 px-5 text-white border-0 focus:ring-yellow-theme focus:outline-none focus:border-yellow-theme"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-white">
              Referred by{" "}
              <span className="text-[#6B7280] text-xs"> (optional)</span>
            </div>
            <input
              type="text"
              id="referredby"
              name="referredby"
              placeholder="Enter referral account address"
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
          <div className="flex flex-col gap-2">
            <div className="text-sm text-white"> Confirm Password</div>
            <div className="bg-[#1E1E21] rounded-lg w-full py-3 px-5 text-white flex gap-2 items-center justify-between">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="bg-transparent text-white border-0 focus:ring-0 focus:outline-none focus:border-0 p-0 w-full"
              />
              {showConfirmPassword ? (
                <BsEyeSlash
                  onClick={() => setShowConfirmPassword(false)}
                  className="cursor-pointer text-gray-shade-4"
                />
              ) : (
                <BsEye
                  onClick={() => setShowConfirmPassword(true)}
                  className="cursor-pointer text-gray-shade-4"
                />
              )}
            </div>
          </div>

          <div>
            <button className="w-full py-3 flex justify-center rounded-lg font-bold bg-yellow-theme mt-2 text-[#222531] dynamicTranss">
              Register account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
