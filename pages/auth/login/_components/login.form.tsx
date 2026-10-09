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
import { ConnectWalletComp } from "@/components/connect.wallet";

const ButtonsText = {
  connect_metamask: "Connect to Metamask",
  login_metamask: "Continue",
  connect_wallet: `Connect To ${process.env.NEXT_PUBLIC_BRAND_NAME} Wallet`,
  loading: "Continue...",
};

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@centher.io";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Demo1234!";

export const LoginForm: React.FC = () => {
  const { mutate } = useSWRConfig();

  const router = useRouter();

  const {
    signMessage,
    disconnectWallet,
    getWalletType,
    connectWallet,
    openWallet,
    connectedAddress,
  } = useWallet();

  const [isLoading, setIsLoading] = useState<LoadingState>("idle");
  const [emailLoading, setEmailLoading] = useState<LoadingState>("idle");
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const wallet_type = getWalletType();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailLoading("loading");
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        user?: unknown;
        message?: string;
      };
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      toast.success("Welcome back");
      setEmailLoading("loaded");
      await mutate("/api/users/me", data.user, false);
      router.push(AppRoutes.feed.index);
    } catch (error: unknown) {
      setEmailLoading("failed");
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

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
    <div className={`flex h-auto w-full flex-col gap-3`}>
      <form onSubmit={handleEmailLogin} className="space-y-3">
        <p className="text-sm text-[#6B7280]">
          Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </p>
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="Email"
          className="h-11 w-full rounded-[14px] border border-[#2A2D3C] bg-transparent px-3 text-sm text-white outline-none"
          autoComplete="username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="Password"
          className="h-11 w-full rounded-[14px] border border-[#2A2D3C] bg-transparent px-3 text-sm text-white outline-none"
          autoComplete="current-password"
          required
        />
        <Button
          title={emailLoading === "loading" ? ButtonsText.loading : "Sign in"}
          type="submit"
          variant="primary"
          className="flex h-11 w-full items-center justify-center text-[14px]"
          borderRounded="14px"
        />
      </form>

      <div className="my-1 flex items-center gap-2">
        <div className="h-px flex-1 bg-[#2A2D3C]" />
        <span className="text-xs text-[#6B7280]">or wallet</span>
        <div className="h-px flex-1 bg-[#2A2D3C]" />
      </div>

      {connectedAddress ? (
        <>
          <div className="mb-3 flex gap-2 sm:flex-row sm:items-center md:!flex-col md:!items-start">
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
          <Button
            title="Disconnect"
            onClick={() => disconnectWallet()}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px]"
            borderRounded="14px"
          />
          {wallet_type && wallet_type == WalletEnum.WALLET_SERVICE ? (
            <Button
              title="Open Wallet"
              onClick={() => openWallet()}
              variant="primary"
              className="flex h-11 w-full items-center justify-center text-[14px]"
              borderRounded="14px"
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <ConnectWalletComp
            authType="login"
            connectWallet={connectWallet}
            className="flex h-11 w-full items-center justify-center text-[14px]"
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
