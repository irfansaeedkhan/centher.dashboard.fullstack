import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSWRConfig } from "swr";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Joi from "joi";
import toast from "react-hot-toast";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { LoadingState } from "@/models/common";
import { SpinIcon3, MetamaskIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { getNonce, login } from "@/lib/auth";

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
  const [isLoading, setIsLoading] = useState<LoadingState>("idle");

  const handleMetamaskLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!account) return;

    const button = e.currentTarget;
    button.disabled = true;

    setIsLoading("loading");

    // Get Nonce from backend
    try {
      const nonceResponse = await getNonce(account);

      const signature = await (library as Web3Provider)
        .getSigner()
        .signMessage(nonceResponse.nonce_with_message);

      const loginResponse = await login(account, signature);

      toast.success(loginResponse.message);
      setIsLoading("loaded");

      await mutate("/api/users/me", loginResponse.user, false);

      router.push(AppRoutes.feed.index);
    } catch (error: any) {
      button.disabled = false;
      setIsLoading("failed");
      if (error.code === "ACTION_REJECTED") {
        toast.error("Login request rejected.");
        return;
      }

      toast.error(error.message ?? "Something went wrong");
    }
  };

  return (
    <div className={`flex h-auto w-full flex-col gap-6`}>
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
          className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary py-3 font-bold text-gray-shade-5 transition-all hover:bg-brand-primary-dark`}
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
const button = `mt-2 py-3 flex gap-2 w-full font-bold rounded-lg items-center text-gray-shade-5 justify-center bg-brand-primary hover:bg-brand-primary-dark`;
