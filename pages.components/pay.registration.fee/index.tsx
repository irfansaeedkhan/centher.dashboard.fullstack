// React, Next, NPM Packages
import React from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";

// App imports
import useUser from "@/hooks/use.user";
// TODO: Mubashir - create a route for getRegistrationFee instead of getting referral document and deciding fee on frontend
import useRegistrationFee from "@/hooks/use.registration.fee";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { axiosNodeApi } from "@/utils/axios";
import { WalletIcon } from "@/assets/svgs";

// Current directory imports
import { performRegistrationFeeTrx } from "./perform.registration.fee.trx";
import { listenRegistrationFeeTrxStatus } from "./listen.registration.fee.trx.status";

export const RegisterationFee: React.FC = () => {
  const router = useRouter();
  const { user, error: userError, isLoading: userLoading } = useUser();
  const {
    registrationFee,
    error: registrationFeeError,
    isLoading: registrationFeeLoading,
  } = useRegistrationFee();
  const { account, library } = useWeb3React();
  const { connectWallet } = useConnectWallet();

  const payRegistrationFeeHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async (e) => {
    if (registrationFeeError || userError) {
      const error = registrationFeeError || userError;
      toast.error(error.message_description);
      return;
    }

    // TODO: Waqar - show loading spinner and disable button
    const button = e.currentTarget;
    button.disabled = true;

    // Account is already connected because we are showing this button only when account is connected
    const result = await performRegistrationFeeTrx(
      library,
      user!,
      registrationFee!
    );

    if (result.status !== "success") {
      toast.error(result.message_description, {
        style: {
          wordBreak: "break-word",
          maxWidth: "466px",
        },
      });
      button.disabled = false;
      return;
    }

    // Call the API to update the user's registration status
    try {
      const { data } = await axiosNodeApi.post(
        "/api/auth/registration-fee-trx",
        {
          trx_hash_bnb: result.data.hash,
          trx_amount_bnb: Number(ethers.utils.formatEther(result.data.value)),
        }
      );

      toast.success(data.message_description);

      // Listen for the transaction status
      listenRegistrationFeeTrxStatus({
        trxHash: result.data.hash,
        button,
        router,
      });
    } catch (error: any) {
      button.disabled = false;
      toast.error(
        error?.response?.data?.message_description ??
          error.message ??
          "Something went wrong"
      );
    }
  };

  return (
    <div className={wrapper}>
      <div className={fieldWrapper}>
        <WalletIcon />
      </div>
      <h3 className={fieldTitle}>Pay Registeration Fee</h3>
      <p className={text}>
        Please pay registeration fee to start using your account.
      </p>
      <div className="mt-8">
        <p className="text-brand-primary text-center font-semibold tracking-wider text-base">
          {registrationFeeLoading ? (
            <>Loading...</>
          ) : (
            <>{!registrationFeeError ? `${registrationFee} BNB` : "---"} </>
          )}
        </p>
        {account ? (
          <button
            className={button}
            onClick={payRegistrationFeeHandler}
            disabled={registrationFeeLoading || userLoading}
          >
            Pay fee
          </button>
        ) : (
          // TODO: Waqar, Mubashir - Discuss about this button with amjad
          <button
            className={connectButton}
            onClick={() => connectWallet()}
            disabled={registrationFeeLoading || userLoading}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

// Styles
const wrapper = ctl(`
  flex 
  gap-6
  w-full 
  h-auto 
  flex-col 
`);

const fieldWrapper = ctl(`
  flex 
  gap-2
  flex-col 
`);

const fieldTitle = ctl(`
  text-lg
  text-white
  font-semibold 
`);

const text = ctl(`
  text-sm 
  text-gray-shade-4
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
  transition-all 
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
