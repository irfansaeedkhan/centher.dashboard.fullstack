// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-hot-toast";

// App imports
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { ModalWrapper } from "@/components/modal";
import { AppRoutes } from "@/constants/app.routes";
import { SpinIcon2, Successfully, WalletIconModal } from "@/assets/svgs";

// Current directory imports
import { InputField } from "./input.field";
import { SignupState, FeeModalState } from "./form.fields.data";
import {
  getRegistrationFee,
  registerWithSmartContract,
} from "./register.with.smart.contract";
import Image from "next/future/image";
import { MetamaskIcon } from "@/assets/svgs";

// Initial Signup State
const initialSignupState: SignupState = {
  account_address: "",
  referred_by: "",
};

// Initial Fee Modal State
const initialFeeModalState: FeeModalState = {
  isOpen: false,
  status: "start",
  fee: "--",
};

export const RegisterForm: React.FC = () => {
  const [feeModal, setFeeModal] = useState<FeeModalState>(initialFeeModalState);
  const [signupState, setSignupState] =
    useState<SignupState>(initialSignupState);
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();
  const { account, library } = useWeb3React();
  const { connectWallet } = useConnectWallet();

  // Set account address and referred by address
  useEffect(() => {
    setSignupState((prev) => ({
      ...prev,
      account_address: account ?? "",
      referred_by: router.query.referred_by?.toString() ?? "",
    }));
  }, [account, router.query.referred_by]);

  // Pay registration fee and register user
  const payFee: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (feeModal.fee === "--") {
      toast.error("Please wait for the fee to load");
      return;
    }

    setFeeModal((prev) => ({ ...prev, status: "progress" }));

    const res = await registerWithSmartContract(
      library,
      signupState,
      feeModal.fee
    );

    if (res.status === "error") {
      setFeeModal((prev) => ({ ...prev, status: "start" }));
      toast.error(res.message_description || "Something went wrong");
      return;
    }

    toast.success(res.message_description);
    setFeeModal((prev) => ({ ...prev, status: "end", isOpen: false }));

    // Redirect to login page
    router.push(AppRoutes.auth.login);
  };

  // Open fee modal and get registration fee from smart contract
  const openFeeModal = async () => {
    if (!account) {
      toast.error("Please connect wallet first!");
      return;
    }

    setFeeModal((prev) => ({ ...prev, isOpen: true }));

    try {
      const registrationFee = await getRegistrationFee(library, signupState);
      setFeeModal((prev) => ({ ...prev, fee: registrationFee }));
    } catch (err: any) {
      toast.error(err.message_description ?? "Could not get registration fee!");
      setFeeModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <>
      <form className={wrapper} onSubmit={payFee}>
        {account ? (
          <>
            <div className="flex flex-col gap-2">
              <MetamaskIcon />
            </div>
            <InputField
              id="account_address"
              label="Wallet Address"
              placeholder="Enter your account address"
              type="text"
              readOnly
              defaultValue={signupState.account_address}
            />
          </>
        ) : (
          <button
            className={connectButton}
            type="button"
            onClick={connectWallet}
          >
            <Image
              src="/images/metamask_icon.png"
              alt="metamask_icon.png"
              width={20}
              height={20}
            />
            <p>Connect</p>
          </button>
        )}

        <InputField
          id="referred_by"
          label={
            <>
              Referred by{" "}
              <span className="text-[#6B7280] text-xs"> (optional)</span>
            </>
          }
          placeholder="Enter referrer account address"
          type="text"
          readOnly
          defaultValue={signupState.referred_by}
        />

        <div className="flex gap-2">
          <input
            type="checkbox"
            name=""
            id=""
            onClick={() => setIsChecked(!isChecked)}
          />
          <p className="text-white text-sm">
            I have read and agree to Binance&apos;s{" "}
            <span className="font-semibold underline">Terms of Service</span>{" "}
            and <span className="font-semibold underline">Privacy Policy.</span>
          </p>
        </div>

        {isChecked ? (
          <button type="button" onClick={openFeeModal} className={button}>
            Register
          </button>
        ) : (
          <button type="button" className={buttonDisabled} disabled>
            Register
          </button>
        )}

        <ModalWrapper
          title="Registration Fee"
          isOpen={feeModal.isOpen}
          onClose={() => {
            feeModal.status !== "progress" &&
              setFeeModal((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          <div className={feeWrapper}>
            <div className={feeModalWrapper}>
              {feeModal.status === "start" ? (
                <WalletIconModal />
              ) : feeModal.status === "progress" ? (
                <SpinIcon2 />
              ) : (
                feeModal.status === "end" && <Successfully />
              )}
            </div>
            <div className={feeModalStatus}>
              <h2 className={feeModalProgress}>
                {feeModal.status === "start"
                  ? "Pay Registration Fee"
                  : feeModal.status === "progress"
                  ? "Transaction in progress"
                  : feeModal.status === "end" && "Successfully"}
              </h2>
              {feeModal.status === "start" ? (
                <p className={textFee}>{`${feeModal.fee} BNB`}</p>
              ) : feeModal.status === "progress" ? (
                <p className={modalInnerText}>
                  Please do not close or refresh page.
                </p>
              ) : (
                feeModal.status === "end" && (
                  <p className={registrationCompleted}>
                    Transaction done successfully. Registering user on platform
                  </p>
                )
              )}
            </div>
            <div>
              {feeModal.status === "start" ? (
                <button className={button} type="submit">
                  Pay
                </button>
              ) : (
                (feeModal.status === "progress" ||
                  feeModal.status === "end") && (
                  <button className={button2} type="button" disabled>
                    Ok
                  </button>
                )
              )}
            </div>
          </div>
        </ModalWrapper>
      </form>
    </>
  );
};

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
  items-center 
  text-gray-shade-5
  justify-center 
  !bg-brand-primary 
  hover:!bg-brand-primary-dark
  transition-all 
`);

const buttonDisabled = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg
  items-center 
  text-gray-shade-7
  justify-center 
  !bg-gray-shade-3
  cursor-not-allowed
  transition-all 
`);

const connectButton = ctl(`
  mt-6 
  py-3 
  flex
  gap-2
  w-full 
  font-bold 
  rounded-lg 
  items-center 
  transition-all 
  justify-center 
  !bg-brand-primary 
  text-gray-shade-5 
  hover:!bg-brand-primary-dark
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
  !bg-black-shade-7
  cursor-not-allowed
`);

const feeWrapper = ctl(`
lg:px-10 sm:px-5 flex flex-col lg:gap-6 sm:gap-3 pt-5 pb-8
`);

const feeModalWrapper = ctl(`flex justify-center`);

const feeModalStatus = ctl(`flex flex-col gap-2 items-center`);

const feeModalProgress = ctl(
  `font-semibold lg:text-lg sm:text-xs text-center text-white`
);

const textFee = ctl(
  `text-brand-primary text-center font-semibold tracking-wider text-base`
);

const modalInnerText = ctl(`text-sm text-center text-gray-shade-2`);

const registrationCompleted = ctl(`text-sm text-center text-gray-shade-2`);
