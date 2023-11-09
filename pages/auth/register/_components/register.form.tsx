import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Button from "@/components/button";
import { ModalWrapper } from "@/components/modal";
import { AppRoutes } from "@/constants/app.routes";
import { WalletEnum, useWallet } from "@/web3/hooks/use.wallet";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { customLog } from "@/utils/custom.log";
import {
  SpinIcon2,
  Successfully,
  WalletIconModal,
  MetamaskIcon,
} from "@/assets/svgs";
import { InputField } from "@/pages/auth/register/_components/input.field";
import {
  SignupState,
  FeeModalState,
} from "@/pages/auth/register/_components/form.fields.data";
import {
  getRegistrationFee,
  registerWithSmartContract,
} from "@/pages/auth/register/_components/register.with.smart.contract";
import { ConnectWalletComp } from "@/components/connect.wallet";

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
  const {
    disconnectWallet,
    connectedAddress,
    getSigner,
    openWallet,
    getWalletType,
  } = useWallet();
  const wallet_type = getWalletType();

  // Set account address and referred by address
  useEffect(() => {
    setSignupState((prev) => ({
      ...prev,
      account_address: connectedAddress ?? prev.account_address ?? "",
      referred_by:
        router.query.referred_by?.toString() ?? prev.referred_by ?? "",
    }));
  }, [connectedAddress, router.query.referred_by]);

  // Pay registration fee and register user
  const payFee: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (feeModal.fee === "--") {
      toast.error("Please wait for the fee to load");
      return false;
    }
    setFeeModal((prev) => ({ ...prev, status: "progress" }));
    try {
      let res;
      res = await registerWithSmartContract(
        getSigner()!,
        signupState,
        feeModal.fee
      );

      toast.success(res.message_description);
      setFeeModal((prev) => ({ ...prev, status: "end", isOpen: false }));

      // Redirect to login page
      router.push(AppRoutes.auth.login);
    } catch (err: any) {
      customLog(["development", "staging"], err);
      setFeeModal((prev) => ({ ...prev, status: "start" }));
      toast.error(err.message_description || "Something went wrong");
    }
  };

  // Open fee modal and get registration fee from smart contract
  const openFeeModal = async () => {
    if (!connectedAddress) {
      toast.error("Please connect wallet first!");
      return;
    }

    setFeeModal((prev) => ({ ...prev, isOpen: true }));

    try {
      const registrationFee = await getRegistrationFee(
        getSigner()!,
        signupState
      );
      setFeeModal((prev) => ({ ...prev, fee: registrationFee }));
    } catch (err: any) {
      toast.error(err.message_description ?? "Could not get registration fee!");
      setFeeModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <>
      <form className="flex h-auto w-full flex-col gap-6" onSubmit={payFee}>
        {connectedAddress ? (
          <div className="flex gap-2 sm:flex-row sm:items-center md:!flex-col md:!items-start">
            <span onClick={() => openWallet()} className="!h-12 !w-12">
              <MetamaskIcon />
            </span>
            <div className="flex flex-grow flex-col">
              <p className="font-semibold text-white sm:text-base md:mt-4 md:text-lg">
                Metamask wallet connected
              </p>
              <div className="flex items-center gap-1">
                <p className="text-sm text-[#6B7280]">Wallet Address:</p>
                <p className="text-sm text-white">
                  {sliceAccountAddress(connectedAddress)}
                </p>
              </div>
            </div>
            <Button
              title="Disconnect"
              onClick={() => disconnectWallet()}
              variant="primary"
              className="flex h-11 w-full items-center justify-center text-[14px]"
              borderRounded="14px"
            />
          </div>
        ) : (
          <ConnectWalletComp
            className="flex h-11 w-full items-center justify-center rounded-xl text-[14px]"
            notloginCheck={true}
          />
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
          <Button
            type="button"
            title={"Register"}
            onClick={openFeeModal}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px]"
            borderRounded="14px"
          />
        ) : (
          <Button
            type="button"
            title={"Register"}
            disabled
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px]"
            borderRounded="14px"
          />
        )}

        {wallet_type == WalletEnum.WALLET_SERVICE ? (
          <Button
            type="button"
            title="Open Wallet"
            onClick={() => openWallet()}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px]"
            borderRounded="14px"
          />
        ) : (
          <></>
        )}

        <ModalWrapper
          title="Registration"
          isOpen={feeModal.isOpen}
          onClose={() => {
            feeModal.status !== "progress" &&
              setFeeModal((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          <div className="flex flex-col pb-8 pt-5 sm:gap-3 sm:px-5 lg:gap-6 lg:px-10">
            <div className="flex justify-center">
              {feeModal.status === "start" ? (
                <WalletIconModal />
              ) : feeModal.status === "progress" ? (
                <SpinIcon2 className="animate-spin" />
              ) : (
                feeModal.status === "end" && <Successfully />
              )}
            </div>
            <div className="flex flex-col items-center gap-2">
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
                  <p className="textGradient text-center text-base font-semibold tracking-wider">{`${feeModal.fee} BNB`}</p>
                )
              ) : feeModal.status === "progress" ? (
                <p className={registrationCompleted}>
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
                <Button
                  type="submit"
                  title={Number(feeModal.fee) === 0 ? "Join For Free" : "Pay"}
                  variant="primary"
                  className="flex h-11 w-full items-center justify-center text-[14px]"
                  borderRounded="14px"
                />
              ) : (
                (feeModal.status === "progress" ||
                  feeModal.status === "end") && (
                  <Button
                    type="button"
                    title={"Ok"}
                    disabled
                    variant="primary"
                    className="flex h-11 w-full items-center justify-center text-[14px]"
                    borderRounded="14px"
                  />
                )
              )}
            </div>
          </div>
        </ModalWrapper>
      </form>
    </>
  );
};

const registrationCompleted = `text-sm text-center text-gray-shade-2`;
