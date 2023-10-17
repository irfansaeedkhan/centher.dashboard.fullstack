import React, { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import Joi from "joi";
import { LoadingState } from "@/models/common";
import { AppRoutes } from "@/constants/app.routes";
import { getNonce, login } from "@/lib/auth";
import Button from "@/components/button";
import { useWallet, WalletEnum } from "@/web3/hooks/use.wallet";

const ButtonsText = {
  connect_metamask: "Connect to Metamask",
  login_metamask: "Continue",
  connect_wallet: "Connect To Wallet",
  loading: "Continue...",
};

export const LoginForm: React.FC = () => {
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { connectWallet, connectedAddress, signMessage } = useWallet();
  const [isLoading, setIsLoading] = useState<LoadingState>("idle");

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!connectedAddress) return;

    const button = e.currentTarget;
    button.disabled = true;

    setIsLoading("loading");

    // Get Nonce from backend
    try {
      const nonceResponse = await getNonce(connectedAddress);
      const signature = await signMessage(nonceResponse.nonce_with_message);
      const loginResponse = await login(connectedAddress, signature);

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
      {connectedAddress ? (
        <>
          <div className="flex gap-2 sm:flex-row sm:items-center md:!flex-col md:!items-start">
            <div className="flex flex-grow flex-col">
              <p className="font-semibold text-white sm:text-base md:mt-4 md:text-lg">
                wallet connected
              </p>
              <div className="flex items-center gap-1">
                <p className="text-sm text-[#6B7280]">Wallet Address:</p>
                <p className="text-sm text-white">
                  {connectedAddress.slice(0, 6) +
                    "..." +
                    connectedAddress.slice(38, 42)}
                </p>
              </div>
            </div>
          </div>

          <Button
            title={
              isLoading === "loading"
                ? ButtonsText.loading
                : ButtonsText.login_metamask
            }
            onClick={handleLogin}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px]"
            borderRounded="14px"
          />
        </>
      ) : (
        <div>
          <Button
            title={ButtonsText.connect_metamask}
            onClick={async () => await connectWallet(WalletEnum.METAMASK)}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px]"
            borderRounded="14px"
          />

          <Button
            title={ButtonsText.connect_wallet}
            onClick={async () => await connectWallet(WalletEnum.WALLET_SERVICE)}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px]"
            borderRounded="14px"
          />
        </div>
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
