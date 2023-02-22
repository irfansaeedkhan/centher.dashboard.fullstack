// React, Next, NPM Packages
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Joi from "joi";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/image";

// App imports
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";
import { SpinIcon3, MetamaskIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

const ButtonsText = {
  connect_metamask: "Connect to Metamask",
  login_metamask: "Continue",
  loading: "Continue...",
};

export const LoginForm: React.FC = () => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { connectWallet } = useConnectWallet();
  const { account, library } = useWeb3React();
  const [isLoading, setisLoading] = useState<LoadingState>("idle");

  const handleMetamaskLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = e.currentTarget;
    button.disabled = true;

    setisLoading("loading");

    // Get Nonce from backend
    try {
      const { data: nonceData } = await axiosNodeApi.get(
        `/api/auth/get-nonce/${account}`
      );

      const signature = await (library as Web3Provider)
        .getSigner()
        .signMessage(nonceData.auth_nonce);

      const { data: loginData } = await axiosNodeApi.post("/api/auth/login", {
        account_address: account,
        signature,
      });

      toast.success(loginData.message_description);
      setisLoading("loaded");

      await mutate("/api/users/me", loginData.user, false);

      router.push(AppRoutes.feed.index);
    } catch (error: any) {
      console.dir(error);
      button.disabled = false;
      setisLoading("failed");
      if (error.code === "ACTION_REJECTED") {
        toast.error("Login request rejected.");
        return;
      }
      if (error?.response?.status === 404) {
        toast.error("User not found.");
        return;
      }

      if (error?.response?.data?.message === "already_logged_in") {
        window.location.href = AppRoutes.feed.index;
        return;
      }

      if (error?.response?.data?.message_description) {
        toast.error(error.response.data.message_description);
        return;
      }
      toast.error(error.message ?? "Something went wrong");
    }
  };

  return (
    <div className={wrapper}>
      {account ? (
        <>
          <div className="flex gap-2 sm:flex-row sm:items-center md:!flex-col md:!items-start">
            <span className="!h-12 !w-12">
              <MetamaskIcon />
            </span>
            <div className="flex flex-grow flex-col">
              <p className="font-semibold text-white sm:text-base md:mt-4 md:text-lg">
                Metamask wallet connected
              </p>
              <div className="flex items-center gap-1">
                <p className="text-sm text-[#6B7280]">Wallet Address:</p>
                <p className="text-sm text-white">
                  {account.slice(0, 6) + "..." + account.slice(38, 42)}
                </p>
              </div>
            </div>
          </div>

          <button className={button} onClick={handleMetamaskLogin}>
            {isLoading === "loading" ? (
              <>
                <SpinIcon3 className="animate-spin" />
                {ButtonsText.loading}
              </>
            ) : (
              ButtonsText.login_metamask
            )}
          </button>
        </>
      ) : (
        <button
          className={connectButton}
          onClick={async () => await connectWallet()}
        >
          <Image
            src="/images/metamask_icon.png"
            alt="metamask_icon.png"
            width={20}
            height={20}
          />
          <p>{ButtonsText.connect_metamask}</p>
        </button>
      )}
    </div>
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

const button = ctl(`
  mt-2 
  py-3 
  flex
  gap-2
  w-full 
  font-bold 
  rounded-lg 
  items-center 
  text-gray-shade-5 
  justify-center 
  bg-brand-primary 
  hover:bg-brand-primary-dark
`);

const connectButton = ctl(`
  mt-2 
  py-3 
  flex
  gap-2
  w-full 
  font-bold 
  rounded-lg 
  items-center 
  transition-all 
  justify-center 
  bg-brand-primary 
  text-gray-shade-5 
  hover:bg-brand-primary-dark
`);
