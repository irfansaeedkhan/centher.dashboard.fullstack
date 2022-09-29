// React, Next, NPM Packages
import React from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Joi from "joi";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";
import { SpinIcon } from "@/assets/svgs";

const ButtonsText = {
  connect_metamask: "Connect to Metamask",
  login_metamask: "Login with Metamask",
  loading: "Logging in...",
};

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { connectWallet } = useConnectWallet();
  const { account, library } = useWeb3React();

  const handleMetamaskLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // TODO: Waqar - add a spinner on button
    const button = e.currentTarget;
    button.disabled = true;
    button.innerText = ButtonsText.loading;

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

      const user = loginData.user;

      toast.success(loginData.message_description);

      // Redirect to home / pay-registration-fee page
      router.push(
        user.status === "registration_fee_pending"
          ? AppRoutes.auth.pay_registration_fee
          : AppRoutes.home
      );
    } catch (error: any) {
      button.disabled = false;
      button.innerText = ButtonsText.login_metamask;
      if (error.code === "ACTION_REJECTED") {
        toast.error("Login request rejected.");
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
          <p className="text-white">Connected Account:</p>
          <p className="text-white">{account}</p>

          <button className={button} onClick={handleMetamaskLogin}>
            {ButtonsText.login_metamask}
          </button>
        </>
      ) : (
        <button
          className={connectButton}
          onClick={async () => await connectWallet()}
        >
          {ButtonsText.connect_metamask}
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
  w-full 
  font-bold 
  rounded-lg 
  text-gray-shade-5 
  justify-center 
  bg-brand-primary 
  hover:bg-brand-primary-dark
`);

const connectButton = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg 
  justify-center 
  text-brand-primary
  bg-black-shade-7
  hover:bg-black-shade-4
  transition-all 
`);
