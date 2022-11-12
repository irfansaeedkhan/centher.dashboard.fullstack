// React, Next, NPM Packages
import React, { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/image";

// App imports
import {
  useBusdAllowance,
  useBusdBalance,
  useGetPurchasedInfo,
  useIsRegistered,
  useNtrdaoBalance,
  useRoundState,
} from "@/web3/hooks/use.contracts.functions";
import Button from "@/components/button";
import { CustomProgressModal } from "@/components/modal/custom.progress.modal";
import { LoadingSkeleton } from "@/web3/utils/utils";
import { buyNtrDao, setBusdApprove } from "@/web3/utils/call.helpers";
import {
  PurchasedInfo,
  PurchasedInfoResponse,
  RoundInfo,
  RoundState,
} from "@/web3/constants/types";
import { DAY } from "@/web3/constants/common";

import { BUSDIcon, LeftArrowIcon, LockedIcon } from "@/assets/svgs";

// Current directory imports
import { NTRDAOTable } from "./ntrdao.table";

export const PurchaseNTRDAOCard: React.FC<PurchaseNTRDAOCardProps> = ({
  round,
  roundInfo,
  ntrdaoBalance,
  busdBalance,
  busdAllowance,
  purchasedInfoResponse,
  roundState,
  isApproved,
  setApproved,
  reload,
  setReload,
}) => {
  // For modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState(<div></div>);
  const [modalTitle, setModalTitle] = useState<string>(
    "Authorization Contract"
  );
  const [modalSubTitle, setModalSubTitle] = useState<string>("");
  const [modalStatus, setModalStatus] = useState("success");
  const [modalDescription, setModalDescription] = useState<string>("");
  const [modalButtonTitle, setModalButtonTitle] = useState<string>("");

  const { account, library } = useWeb3React();
  const [purchasedInfo, setPurchasedInfo] = useState<PurchasedInfo[]>();
  const [inputBusdAmount, setInputBusdAmount] = useState("");
  const [ntrDaoAmount, setNtrDaoAmount] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [inputNtrAmount, setInputNtrAmount] = useState("");
  const [busdAmountForSwap, setBusdAmountForSwap] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const getPurchasedInfo = (
      purchasedInfoResponse: PurchasedInfoResponse[],
      roundInfo: RoundInfo
    ) => {
      const rawPurchasedInfo = purchasedInfoResponse;
      const _roundInfo = roundInfo;
      const parsedPurchasedInfo = rawPurchasedInfo.map((item: any) => {
        const _purchasedDate = new Date(
          item.purchasedDate * 1000
        ).toLocaleDateString("default");
        const _contributedBusdAmount = Number(item.contributedBusdAmount);
        const _ntrdaoAmount = Number(
          Number(_contributedBusdAmount / _roundInfo.price).toFixed(4)
        );
        const _bonusAmount = Number(
          Number(
            ((_contributedBusdAmount / _roundInfo.price) *
              _roundInfo.bonusRate) /
              100
          ).toFixed(4)
        );
        const _locckmonths = _roundInfo.lockMonths;
        const _remainingDate =
          Math.floor(
            (_locckmonths * 30 * DAY -
              (Math.floor(Date.now() / 1000) - item.purchasedDate)) /
              DAY
          ) + 1;
        const _claimed = item.claimedAmount > 0 ? true : false;
        return {
          purchasedDate: _purchasedDate,
          contributedBusdAmount: _contributedBusdAmount,
          ntrdaoAmount: _ntrdaoAmount,
          bonusAmount: _bonusAmount,
          lockmonths: _locckmonths,
          remainingDate: _remainingDate,
          claimed: _claimed,
        };
      });
      setPurchasedInfo(parsedPurchasedInfo);
    };
    if (account && purchasedInfoResponse && roundInfo)
      getPurchasedInfo(purchasedInfoResponse, roundInfo);
  }, [account, purchasedInfoResponse, roundInfo]);

  // functions
  const validate = () => {
    if (busdAmountForSwap === 0) {
      toast.error("Please Enter Correct BUSD Amount!");
      return false;
    }
    return true;
  };

  const handleBuyNtrdao = async () => {
    try {
      setPending(true);
      setModalStatus("progress");
      const result = await buyNtrDao(
        library,
        BigNumber.from(busdAmountForSwap)
      );
      setReload(!reload);
      setPending(false);
      if (result.success) {
        toast.success("Purchased Successed!");
        setModalSubTitle("Bought Success!");
        setModalStatus("success");
        setModalDescription(
          `You bought NTR tokens. NTRDAO will be locked for ${roundInfo?.lockMonths} months. You can claim when unlock.`
        );
        setModalButtonTitle("");
        setShowModal(true);
      } else {
        toast.error("Transaction has been failed.");
        setModalStatus("failed");
      }
    } catch (error) {
      setModalStatus("failed");
      setPending(false);
    }
  };

  const buyNowFunc = () => {
    if (!validate()) return;
    setModalTitle("Buy Now");
    setModalSubTitle("Do you want to buy NTRDAO?");
    setModalStatus(`ntrdao`);
    setModalDescription(
      `Confirmation that you pay ${busdAmountForSwap} BUSD to buy ${ntrDaoAmount} NTRDAO & ${bonusAmount} NTRDAO as a bonus.`
    );
    setModalButtonTitle("Buy Now");
    setShowModal(true);
  };

  const handleAuthorize = async () => {
    try {
      setPending(true);
      setModalStatus("progress");
      const result = await setBusdApprove(library);
      setPending(false);
      if (result.success) {
        // setContractState("Buy Now");
        setApproved(true);
        setModalTitle("Authorization Contract");
        setModalSubTitle("Authorized Successfully");
        setModalStatus(`success`);
        setModalDescription(
          `Your Contract has been Authorized, Now you can buy Packs.`
        );
        setModalButtonTitle("");
        setShowModal(true);
      } else {
        toast.error("Transaction has been failed.");
        setModalStatus("failed");
      }
    } catch (error) {
      setModalStatus("failed");
      setPending(false);
    }
  };

  const authorizeFunc = () => {
    setModalTitle("Authorization Contract");
    setModalSubTitle("Allow Nether NFT to use your NTR?");
    setModalStatus(`warning`);
    setModalDescription(
      `Confirmation of the NTR token to interact with the Nether NFT contract.`
    );
    setModalButtonTitle("Authorize");
    setShowModal(true);
  };

  const handleChange = async (event: any) => {
    const value = Number(event.target.value);
    if (account && value >= busdBalance) {
      event.target.value = busdBalance;
    }
    if (value === 0) {
      event.target.value = "";
      setBusdAmountForSwap(0);
      setNtrDaoAmount(0);
      setInputBusdAmount("");
      setInputNtrAmount("");
      return;
    }
    if (roundInfo != null) {
      const toValue = event.target.value / roundInfo.price;
      setInputBusdAmount(event.target.value);
      setBusdAmountForSwap(event.target.value);
      setNtrDaoAmount(toValue);
      setBonusAmount(
        Number(
          Number(
            ((event.target.value / roundInfo.price) * roundInfo.bonusRate) / 100
          ).toFixed(4)
        )
      );
      setInputNtrAmount(toValue.toString());
    }
  };

  const handleMax = async () => {
    if (busdBalance === 0) {
      setBusdAmountForSwap(0);
      setNtrDaoAmount(0);
      setInputBusdAmount("");
      setInputNtrAmount("");
      return;
    }
    setInputBusdAmount(busdBalance.toString());
    setBusdAmountForSwap(busdBalance);
    const toValue = busdBalance / 500;
    setNtrDaoAmount(toValue);
    setInputNtrAmount(toValue.toString());
  };

  return (
    <div className="relative">
      <div
        className={`${
          round > roundState ? "block" : "hidden"
        } ${lockedContainer}`}
      >
        <div className={lockedContent}>
          <LockedIcon className="w-[80px] h-[80px]" />
          <h6 className={lockedContentMessage}>
            Need a messsage to show for users
          </h6>
        </div>
      </div>
      <div className={`${round > roundState && "blur-xl bg-black-shade-3/60"}`}>
        <div className={transactionBox}>
          <h1 className={transactionBoxTitle}>
            Please Enter NTRDAO amount to you’d like to purchase
          </h1>
          <div className={divider}></div>
          <div className={conversionBox}>
            <div className={ConversioninputContainer}>
              <div className={inputBox}>
                <div className={coinBox}>
                  <BUSDIcon /> <h5 className={coinName}>BUSD </h5>
                </div>
                <div className={balanceBox}>
                  <div>
                    <h5 className={balanceText}>Balance</h5>
                    <h6 className={balanceNumber}>
                      {account ? (
                        `${Number(busdBalance).toString()}`
                      ) : (
                        <LoadingSkeleton />
                      )}
                    </h6>
                  </div>
                </div>
              </div>
              <div className={inputBox}>
                <input
                  className={input}
                  type="text"
                  placeholder="0.00"
                  value={inputBusdAmount}
                  onChange={handleChange}
                />
                <div className={maxBtnContainer}>
                  <div>
                    <button className={maxBtn} onClick={handleMax}>
                      Max
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={conversionBtn}>
              <LeftArrowIcon />
            </div>
            <div className={ConversioninputContainer}>
              <div className={inputBox}>
                <div className={coinBox}>
                  <Image
                    src={"/images/buyntr.png"}
                    alt="buyntr"
                    width={40}
                    height={40}
                    className="!w-10 !h-10"
                  />
                  <h5 className={coinName}>NTRDAO </h5>
                </div>
                <div className={balanceBox}>
                  <div>
                    <h5 className={balanceText}>Balance</h5>
                    <h6 className={balanceNumber}>
                      {account ? (
                        `${Number(ntrdaoBalance).toString()}`
                      ) : (
                        <LoadingSkeleton />
                      )}
                    </h6>
                  </div>
                </div>
              </div>
              <div className={inputBox}>
                <input
                  className={input}
                  type="text"
                  placeholder="0.00"
                  value={inputNtrAmount}
                  readOnly
                />
                <div className={maxBtnContainer}>&nbsp;</div>
              </div>
            </div>
          </div>
          {roundState === round && (
            <div className={conversionBoxFooter}>
              <h6 className={conversionBoxFooterTitle}>
                Price:{" "}
                <span className={conversionBoxFooterTitleBold}>500 BUSD</span>
              </h6>
              <Button
                title={isApproved ? "Buy now" : "Authorize"}
                variant="v1"
                onClick={isApproved ? buyNowFunc : authorizeFunc}
                className="py-4"
                disabled={account ? false : true}
              />
            </div>
          )}
          {round < roundState && (
            <div className={roundOverTextContainer}>
              <p className={roundOverText}>
                This round is over! Buy another availabe or wait for the next
                round
              </p>
            </div>
          )}
        </div>
        <NTRDAOTable
          purchasedInfo={purchasedInfo}
          reload={reload}
          setReload={setReload}
          roundNumber={round}
        />
      </div>
      {showModal && (
        <CustomProgressModal
          onClose={() => setShowModal(false)}
          title={modalTitle}
          status={modalStatus}
          subTitle={modalSubTitle}
          description={modalDescription}
          buttonTitle={modalButtonTitle}
          handleBuyNow={handleBuyNtrdao}
          handleAutorize={handleAuthorize}
          handleClaim={() => {}}
        />
      )}
    </div>
  );
};

// stying
const lockedContainer = ctl(`
absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center
`);
const lockedContent = ctl(`
flex flex-col justify-center items-center gap-10
`);
const lockedContentMessage = ctl(`
text-20px font-semibold text-white
`);
const transactionBox = ctl(`
bg-background-shade-3 p-8 lg:p-12 rounded-2xl
`);
const transactionBoxTitle = ctl(`
text-24px text-white text-center font-semibold
`);
const divider = ctl(`
h-[2px] my-8 lg:my-12  bg-gray-shade-3
`);
const conversionBox = ctl(`
 flex flex-col lg:flex-row items-center justify-between   gap-5
`);
const ConversioninputContainer = ctl(`
space-y-3  w-full lg:max-w-[354px]
`);
const inputBox = ctl(`
overflow-hidden relative w-full h-[64px] bg-gray-shade-9 border-2 border-gray-shade-3 rounded-2xl px-3  py-4
`);
const input = ctl(`
focus:outline-none  focus:ring-0 outline-0 bg-transparent border-0 items-center absolute top-0 left-0 p-4 w-[calc(100% - 105px)] h-full text-14px text-gray-shade-7 font-semibold
`);
const coinBox = ctl(`
flex items-center gap-3 absolute top-[50%] translate-y-[-50%] left-4
`);
const coinName = ctl(`
text-14px text-white font-semibold
`);
const balanceBox = ctl(`
bg-background-shade-3 pl-4 absolute top-[50%] translate-y-[-50%] right-0 w-full max-w-[95px] lg:max-w-[115px] h-full flex items-center
`);
const balanceText = ctl(`
text-14px text-gray-shade-7 font-semibold
`);
const balanceNumber = ctl(`
text-14px font-semibold text-white
`);
const maxBtnContainer = ctl(`
detail bg-background-shade-3 absolute top-[50%] translate-y-[-50%] right-0 w-full max-w-[95px] lg:max-w-[115px] h-full flex items-center justify-center
`);
const maxBtn = ctl(`
cursor-pointer text-14px text-yellow-theme font-medium border-2 border-gray-shade-3 bg-gray-shade-9 rounded-2xl px-3 py-1 transition hover:bg-yellow-theme hover:text-black-shade-3 hover:border-0
`);
const conversionBtn = ctl(`
cursor-pointer conversionBtn w-[70px] h-[70px] f2xl:w-[100px] f2xl:h-[100px]  bg-gray-shade-9 border-2 border-gray-shade-3 flex items-center justify-center transition hover:scale-110 rounded-full
`);
const conversionBoxFooter = ctl(`
pt-8 lg:pt-12 w-full lg:max-w-[428px] mx-auto text-center
`);
const conversionBoxFooterTitle = ctl(`
text-14px font-semibold text-gray-shade-7 pb-4
`);
const conversionBoxFooterTitleBold = ctl(`
text-white
`);
const roundOverTextContainer = ctl(`
mt-8 lg:mt-12 text-center mx-auto  py-2 px-5 bg-[#E6535A]/10 w-fit rounded-xl
`);
const roundOverText = ctl(`
text-[#E6535A] text-16px font-semibold
 `);

// interfaces
interface PurchaseNTRDAOCardProps {
  round: number;
  roundInfo: RoundInfo | null;
  ntrdaoBalance: number;
  busdBalance: number;
  busdAllowance: number;
  purchasedInfoResponse: PurchasedInfoResponse[] | null;
  roundState: RoundState;
  isApproved: boolean;
  setApproved: any;
  reload: boolean;
  setReload: any;
}
