import { StandardModal } from "@/components/modal/standard.modal";
import { ProgressModalShared } from "@/components/shared";
import { LaunchpadListEnum } from "@/pages/launchpad/create-launchpad/_components/shared-enum";
import { BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import clsx from "clsx";
import React, { useState } from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";

// interface Props {
//   id_no: number;
//   amount: string;
//   endTime: Date;
//   claimed: number;
//   claimable: number;
// }

// id_no,
// amount,
// endTime,
// claimed,
// claimable,

interface Props {
  index: number;
  nowTime: number;
  startTime: number;
  endTime: number;
  claimablePerMonth: number;
  claimedMonths: number;
  claimable: number;
  lock: number;
  purchaseAmount: number;
  claimed: number;
  roundNumber: number;
  tokenSymbol: string;
  token: string;
  percentPerMonth: string;
}

export const NumberTimeline: React.FC<Props> = ({
  index,
  endTime,
  claimable,
  claimablePerMonth,
  claimed,
  tokenSymbol,
  token,
  roundNumber,
  percentPerMonth,
}) => {
  const { getSigner } = useWallet();
  const [progressModel, setProgressModel] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [errorModal, setErrorModal] = useState<false | string>(false);
  const [successModal, setSuccessModal] = useState<false | string>(false);

  const handleClaim = async () => {
    setProgressModel(true);
    setModalTitle(LaunchpadListEnum.claim_amounts);
    const signer = getSigner();
    if (!signer) return;

    try {
      await BlockchainWrite.claimPresaleToken(token, roundNumber - 1, signer);

      setProgressModel(false);
      setSuccessModal("Amount Claimed!");
    } catch (error: any) {
      // console.log(e);
      setProgressModel(false);
      setErrorModal(error?.message ?? "Something went wrong!");
    }
  };

  return (
    <>
      {" "}
      {progressModel && <ProgressModalShared title={modalTitle} />}
      {errorModal && (
        <StandardModal
          confirmButtonText="OK"
          isOpen={errorModal ? true : false}
          title="Transaction Failed"
          subtitle="Transaction Failed"
          bodyText={errorModal ? errorModal : ""}
          status="error"
          onClickClose={() => setErrorModal(false)}
          onClickConfirm={() => setErrorModal(false)}
        />
      )}
      {successModal && (
        <StandardModal
          confirmButtonText="OK"
          isOpen={successModal ? true : false}
          title="Transaction Successful"
          subtitle="Transaction Successful"
          bodyText={successModal ? successModal : ""}
          status="success"
          onClickClose={() => setSuccessModal(false)}
          onClickConfirm={() => setSuccessModal(false)}
        />
      )}
      <div className="relative flex w-full items-center gap-4">
        <div
          className={clsx(
            "flex !h-11 !min-w-[44px] items-center justify-center rounded-full text-xs font-semibold",
            Date.now() > Number(endTime)
              ? "bg-gray-shade-16"
              : "bg-gray-shade-12"
          )}
        >
          {index === 1
            ? index + "st"
            : index === 2
            ? index + "nd"
            : index === 3
            ? index + "rd"
            : index + "th"}
        </div>
        <div className="rainbow-scroll flex h-auto min-h-[88px] max-w-full flex-grow items-center justify-between gap-10 overflow-x-auto rounded-[14px] bg-elevation-1 px-6 py-5">
          <div className="min-w-[260px]">
            <p className="text-sm text-gray-shade-7">Amount</p>
            <h4 className="mt-[6px] text-sm font-semibold text-white">
              {claimablePerMonth?.toFixed(3)} {tokenSymbol} ({percentPerMonth}%)
            </h4>
          </div>
          <Countdown
            date={new Date(endTime * 1000)}
            renderer={countdownRenderer}
          />

          <div className="min-w-[90px]">
            <p className="text-sm text-gray-shade-7">Claimable</p>
            <h4
              className={clsx(
                "text-sm font-semibold",
                claimable > 0 ? "text-white" : "text-[#45474D]"
              )}
            >
              {claimable}
            </h4>
          </div>
          <div className="min-w-[90px]">
            <p className="text-sm text-gray-shade-7">Claimed</p>
            <h4
              className={clsx(
                "text-sm font-semibold",
                claimed > 0 ? "text-white" : "text-[#45474D]"
              )}
            >
              {claimed}
            </h4>
          </div>
          <div className="min-w-[90px]">
            <p className="text-sm text-gray-shade-7">Action</p>
            <button
              className={clsx(
                "text-sm font-semibold",
                claimable
                  ? "text-gradient-1 cursor-pointer"
                  : claimed
                  ? "textGradient opacity-30"
                  : "text-[#45474D]"
              )}
              // onClick={() => {
              //   claimable > 0 && claimed === 0
              //     ? isBUSD
              //       ? openClaimModal("BUSD")
              //       : openClaimModal("NTR")
              //     : null;
              // }}

              onClick={() => {
                handleClaim();
              }}
              disabled={claimable === 0 || claimed > 0}
            >
              Claim now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Countdown Renderer
const countdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="flex !w-[160px] gap-4">
      <div className={mainClass}>
        <p className={paraClass}>Days</p>
        <h4 className={titleClass}>{days}</h4>
      </div>
      <div className={mainClass}>
        <p className={paraClass}>Hrs</p>
        <h4 className={titleClass}>{hours}</h4>
      </div>
      <div className={mainClass}>
        <p className={paraClass}>Min</p>
        <h4 className={titleClass}>{minutes}</h4>
      </div>
      <div className={mainClass}>
        <p className={paraClass}>Sec</p>
        <h4 className={titleClass}>{seconds}</h4>
      </div>
    </div>
  );
};

const mainClass = "flex flex-col items-center";
const titleClass = "font-semibold text-white text-base";
const paraClass = "text-sm text-gray-shade-7";
