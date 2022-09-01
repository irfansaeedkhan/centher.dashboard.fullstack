import Image from "next/image";
import Link from "next/link";
import React from "react";

const ForgotPassword = () => {
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
              Forgot password
            </div>
            <div className="text-sm font-mediumn text-gray-shade-4 text-center">
              Enter the email address you used when you joined and we’ll send
              you instructions to reset your password.
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
              Forgot password
            </div>
            <div className="text-sm font-mediumn text-gray-shade-4">
              Enter the email address you used when you joined and we’ll send
              you instructions to reset your password.
            </div>
          </div>
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
          <div>
            <button className="w-full py-3 flex justify-center rounded-lg font-bold bg-yellow-theme mt-2 text-[#222531] dynamicTranss">
              Send Reset Instructions
            </button>
          </div>
          <div className="bg-gray-shade-6 py-3 px-4 flex flex-col gap-[6px] border border-gray-shade-5 rounded-lg">
            <div className="text-sm font-medium text-white">Note:</div>
            <div className="text-[11px] font-medium text-gray-shade-4">
              If this email address was used to create an account, instructions
              to reset your password will be sent to you. Please check your
              email.
            </div>
            {/* <div className="text-xs font-medium text-white underline cursor-pointer hover:text-yellow-theme">
              <Link href="/resetPassword">Reset Password</Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
