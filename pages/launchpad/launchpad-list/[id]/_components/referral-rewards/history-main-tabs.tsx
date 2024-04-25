import React, { useRef, useState } from "react";
import Button from "@/components/button";
import { BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import clsx from "clsx";
import { useRouter } from "next/router";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ClaimedDataType } from "../data";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { LaunchpadListEnum } from "@/pages/launchpad/create-launchpad/_components/shared-enum";
import { ProgressModalShared } from "@/components/shared";
import { StandardModal } from "@/components/modal/standard.modal";
import { BsThreeDots } from "react-icons/bs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buttons: { title: string; handler: any }[];
  loader: string;
  actionAreaLoading: boolean;
  records?: any[];
  claimedRefData: ClaimedDataType[];
  launchpadData: PresaleDataType;
}

export const HistoryMainTabs: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  claimedRefData,
  launchpadData,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { getSigner } = useWallet();
  const ref = useRef<HTMLDivElement>(null);
  const [buttonPopup, setButtonPopup] = useState(false);

  const [progressModel, setProgressModel] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [errorModal, setErrorModal] = useState<false | string>(false);
  const [successModal, setSuccessModal] = useState<false | string>(false);

  const presaleEndTime = Number(
    launchpadData.roundInfos[Number(launchpadData.roundDeep) - 1].endTime
  );

  const currentTime = Math.floor(Date.now() / 1000);

  const claimRefRewards = async () => {
    setProgressModel(true);
    setModalTitle(LaunchpadListEnum.referrer_claim);
    const signer = getSigner();
    if (!signer) return;
    if (!id) return;

    try {
      await BlockchainWrite.claimAllRefRewards(id.toString(), signer);
      setProgressModel(false);
      setSuccessModal("Reward claimed successfully");
    } catch (error: any) {
      setProgressModel(false);
      setErrorModal(error?.message ?? "Something went wrong!");
    }
  };

  return (
    <>
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
      <div className="flex h-[76px] w-full items-center justify-between gap-5 rounded-xl border border-gray-shade-3 bg-[#1A1B21] px-6">
        <div className="flex w-full items-center gap-1.5">
          <div
            className={clsx(
              "fxm:text-[min(10vw, 20px)] rounded-xl text-sm font-semibold",
              isOpen ? "text-white" : "text-gray-shade-14"
            )}
          >
            {title}
          </div>
          {isOpen ? (
            <div
              className="flex h-6 w-6 flex-shrink-0 cursor-pointer"
              onClick={onClose}
            >
              <IoIosArrowUp className="flex h-6 w-6 flex-shrink-0 text-white" />
            </div>
          ) : (
            <div
              className="flex h-6 w-6 flex-shrink-0 cursor-pointer"
              onClick={onClose}
            >
              <IoIosArrowDown className="flex h-6 w-6 flex-shrink-0 text-gray-shade-14" />
            </div>
          )}
        </div>
        {title === "Claimable Rewards History" && (
          <>
            <Button
              className="hidden w-full max-w-[150px] text-sm fmd:flex"
              title="Claim All"
              borderRounded="10px"
              onClick={async () => claimRefRewards()}
              disabled={
                claimedRefData.length > 0 || currentTime < presaleEndTime
              }
            />
            <div className="relative flex flex-shrink-0 fmd:hidden" ref={ref}>
              <span onClick={() => setButtonPopup(!buttonPopup)}>
                <BsThreeDots className="size-6 cursor-pointer text-gray-shade-14 hover:text-white" />
              </span>
              {buttonPopup && (
                <div className="absolute right-0 top-8 h-auto w-[200px] rounded-lg bg-popup-0">
                  <div className="flex flex-col gap-2 p-4">
                    <Button
                      className="w-full max-w-[150px] text-sm"
                      title="Claim All"
                      borderRounded="10px"
                      onClick={async () => claimRefRewards()}
                      disabled={
                        claimedRefData.length > 0 ||
                        currentTime < presaleEndTime
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
