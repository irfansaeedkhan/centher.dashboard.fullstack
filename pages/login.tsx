import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { BsEye, BsEyeSlash } from "react-icons/bs";

import { setUserAndJwt } from "@/store/slices/auth";
import styles from "@/pages.components/login/styles.module.scss";

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    dispatch(
      setUserAndJwt({
        user: { _id: "123", email: "mhm13dev@gmail.com" },
        jwt: "some_token",
      })
    );
  };

  return (
    <div className={styles.page_wrapper}>
      {/* Section Left */}
      <section className={styles.section_left}>
        <div className="w-fit">
          <Image
            src="/images/nether.nft.logo.login.svg"
            alt="logo"
            width={"166px"}
            height={"40px"}
          />
        </div>
        <div className={styles.section_left_content_wrapper}>
          <div className="w-fit">
            <Image
              src="/images/nether.nft.favicon.vertical.svg"
              alt="logo"
              width={"179px"}
              height={"308px"}
            />
          </div>
          <div className={styles.section_left_text_wrapper}>
            <h1>Login to Netheru</h1>
            <p>
              Login to your account with netheru to sell and buy NFTs on some
              easy steps.
            </p>
          </div>
        </div>
      </section>

      {/* Section Right */}
      <div className={styles.section_right}>
        <div className={styles.section_right_mobile_content_wrapper}>
          <div className="w-fit">
            <Image
              src="/images/nether.nft.logo.login.svg"
              alt="logo"
              width={"166px"}
              height={"40px"}
            />
          </div>
          <div className={styles.section_right_mobile_text_wrapper}>
            <h1>Login to Netheru</h1>
            <p>
              Login to your account with netheru to sell and buy NFTs on some
              easy steps.
            </p>
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
              <Link href="/forgot-password">Forgot password</Link>
            </div>
          </div>
          <div>
            <button
              onClick={handleLogin}
              className="w-full py-3 flex justify-center rounded-lg font-bold bg-yellow-theme mt-2 text-[#222531] dynamicTranss"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
