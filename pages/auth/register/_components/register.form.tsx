import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-hot-toast";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { ModalWrapper } from "@/components/modal";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { AppRoutes } from "@/constants/app.routes";
import {
  SpinIcon2,
  Successfully,
  WalletIconModal,
  MetamaskIcon,
} from "@/assets/svgs";
import { InputField } from "./input.field";
import { SignupState, FeeModalState } from "./form.fields.data";
import {
  getRegistrationFee,
  registerWithSmartContract,
} from "./register.with.smart.contract";

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
      account_address: account ?? prev.account_address ?? "",
      referred_by:
        router.query.referred_by?.toString() ?? prev.referred_by ?? "",
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
    try {
      const res = await registerWithSmartContract(
        library,
        signupState,
        feeModal.fee
      );

      toast.success(res.message_description);
      setFeeModal((prev) => ({ ...prev, status: "end", isOpen: false }));

      // Redirect to login page
      router.push(AppRoutes.auth.login);
    } catch (err: any) {
      process.env.NEXT_PUBLIC_APP_ENV === "development" && console.log(err);
      setFeeModal((prev) => ({ ...prev, status: "start" }));
      toast.error(err.message_description || "Something went wrong");
    }
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
                    {sliceAccountAddress(signupState.account_address)}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <button
            className={connectButton}
            type="button"
            onClick={() => connectWallet()}
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
              <span className="text-xs text-[#6B7280]"> (optional)</span>
            </>
          }
          placeholder="Enter referrer account address"
          type="text"
          value={signupState.referred_by}
          onChange={(e) => {
            setSignupState((prev) => ({
              ...prev,
              referred_by: e.target.value,
            }));
          }}
        />

        <div className="flex gap-2">
          <input
            type="checkbox"
            name=""
            id=""
            onClick={() => setIsChecked(!isChecked)}
          />

          <p className="text-sm text-white">
            I have read and agree to Centher{" "}
            <Link href={AppRoutes.terms}>
              <span className="cursor-pointer font-semibold underline">
                Terms & Condition
              </span>
            </Link>
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
          title="Registration"
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
                <SpinIcon2 className="animate-spin" />
              ) : (
                feeModal.status === "end" && <Successfully />
              )}
            </div>
            <div className={feeModalStatus}>
              {feeModal.status === "start" && Number(feeModal.fee) === 0 && (
                <h2 className="text-center text-xs font-semibold text-white fmd:text-sm flg:text-lg">
                  Referred users do not pay registration fees.
                </h2>
              )}
              {feeModal.status === "start" && Number(feeModal.fee) === 0 && (
                <h2 className="text-center text-xs font-semibold text-white fmd:text-sm flg:text-lg">
                  You only pay gas fee.
                </h2>
              )}
              <h2 className="text-center font-semibold text-white sm:text-xs lg:text-lg">
                {feeModal.status === "start"
                  ? Number(feeModal.fee) !== 0 && "Pay Registration Fee"
                  : feeModal.status === "progress"
                  ? "Transaction in progress"
                  : feeModal.status === "end" && "Successfully"}
              </h2>
              {feeModal.status === "start" ? (
                Number(feeModal.fee) !== 0 && (
                  <p className={textFee}>{`${feeModal.fee} BNB`}</p>
                )
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
                  {Number(feeModal.fee) === 0 ? "Join For Free" : "Pay"}
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

const textFee = ctl(
  `text-brand-primary text-center font-semibold tracking-wider text-base`
);

const modalInnerText = ctl(`text-sm text-center text-gray-shade-2`);

const registrationCompleted = ctl(`text-sm text-center text-gray-shade-2`);
