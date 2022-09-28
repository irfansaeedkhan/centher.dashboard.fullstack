// React, Next, NPM Packages
import React, { useState } from "react";
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
import {
  SpinIcon2,
  Successfully,
  WalletIcon,
  WalletIconModal,
} from "@/assets/svgs";

// Current directory imports
import { performRegistrationFeeTrx } from "./perform.registration.fee.trx";
import { listenRegistrationFeeTrxStatus } from "./listen.registration.fee.trx.status";
import { ModalWrapper } from "@/components/modal";

export const RegisterationFee: React.FC = () => {
  const [feeModal, setFeeModal] = useState(false);
  const [feeModalStatus, setFeeModalStatus] = useState("start");
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
    setFeeModalStatus("progress");
    if (registrationFeeError || userError) {
      const error = registrationFeeError || userError;
      toast.error(error.message_description);
      setFeeModalStatus("start");
      return;
    }

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
      setFeeModalStatus("start");
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
      setFeeModalStatus("end");
      setFeeModal(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message_description ??
          error.message ??
          "Something went wrong"
      );
      setFeeModalStatus("start");
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
        {/* <p className="text-brand-primary text-center font-semibold tracking-wider text-base">
          {registrationFeeLoading ? (
            <>Loading...</>
          ) : (
            <>{!registrationFeeError ? `${registrationFee} BNB` : "---"} </>
          )}
        </p> */}
        {account ? (
          <button
            className={button}
            onClick={() => setFeeModal(true)}
            // disabled={registrationFeeLoading || userLoading}
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
      {feeModal && (
        <ModalWrapper
          title="Registeration Fee"
          onClose={() => setFeeModal(false)}
        >
          <div className="px-10 flex flex-col gap-6 pt-5 pb-8">
            <div className="flex justify-center">
              {feeModalStatus === "start" ? (
                <WalletIconModal />
              ) : feeModalStatus === "progress" ? (
                <SpinIcon2 />
              ) : (
                feeModalStatus === "end" && <Successfully />
              )}
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="font-semibold text-lg text-center text-white">
                {feeModalStatus === "start"
                  ? "Pay Registeration Fee"
                  : feeModalStatus === "progress"
                  ? "Transaction in progress"
                  : feeModalStatus === "end" && "Successfully"}
              </h2>
              {feeModalStatus === "start" ? (
                <p className="text-brand-primary text-center font-semibold tracking-wider text-base">
                  {registrationFeeLoading ? (
                    <>Loading...</>
                  ) : (
                    <>
                      {!registrationFeeError ? `${registrationFee} BNB` : "---"}{" "}
                    </>
                  )}
                </p>
              ) : feeModalStatus === "progress" ? (
                <p className="text-sm text-center text-gray-shade-2">
                  Please do not close or refresh page.
                </p>
              ) : (
                feeModalStatus === "end" && (
                  <p className="text-sm text-center text-gray-shade-2">
                    Transaction done successfully. Registering user on platform
                  </p>
                )
              )}
            </div>
            <div>
              {feeModalStatus === "start" ? (
                <button
                  className={button}
                  onClick={payRegistrationFeeHandler}
                  disabled={registrationFeeLoading || userLoading}
                >
                  Pay
                </button>
              ) : (
                (feeModalStatus === "progress" || feeModalStatus === "end") && (
                  <button className={button2} disabled>
                    Ok
                  </button>
                )
              )}
            </div>
          </div>
        </ModalWrapper>
      )}
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
  items-center 
  text-gray-shade-5 
  justify-center 
  bg-brand-primary
  hover:bg-brand-primary-dark
  transition-all 
`);

const button2 = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg
  items-center 
  text-[#7C81A2] 
  justify-center 
  bg-black-shade-7
  cursor-not-allowed
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
