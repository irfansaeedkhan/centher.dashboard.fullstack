import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { formatEther } from "ethers/lib/utils";
import { DXCIconBG, USDTIcon } from "@/assets/svgs";
import useUser from "@/hooks/use.user";
import {
  getTokenBalance,
  getTokenAllowance,
  useGetContributionInfo,
} from "@/web3/hooks/use.contracts.functions";
import { RoundInfo } from "@/web3/constants/types";
import { useWallet } from "@/web3/hooks/use.wallet";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";
import DetailsProject from "@/pages/launchpad/[token_address]/[round]/_components/details-project";
import BookingMain from "@/pages/launchpad/[token_address]/[round]/_components/booking-main";
import { SelectedTokenA, SelectedTokenB } from "./types";

interface Props {
  roundInfo: RoundInfo;
  currentUserAddress: string | undefined;
  round_number: number;
  connectedAddress: string | undefined | null;
}

export const PurchaseCentherCard: React.FC<Props> = ({
  roundInfo,
  currentUserAddress,
  round_number,
  connectedAddress,
}) => {
  const [roundNo, setRoundNo] = useState<number>(-1);
  const { user: loggedInUser } = useUser();
  const { getSigner, disconnectWallet, connectWallet } = useWallet();
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [currentTab, setCurrentTab] = useState<"details" | "booking">(
    "booking"
  );
  const { contributionInfo, refreshContributionInfo, loadingState } =
    useGetContributionInfo(
      connectedAddress,
      roundInfo,
      roundNo === -1 ? round_number : roundNo
    );
  const [selectedTokenA, setSelectedTokenA] = useState<SelectedTokenA>({
    tokenName: "USDT",
    tokenIcon: (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/5">
        <USDTIcon />
      </span>
    ),
    tokenBalance: 0,
    minContribution: roundInfo ? roundInfo.minContributionForBusd : 0,
    maxContribution: roundInfo ? roundInfo.maxContributionForBusd : 0,
    rate: roundInfo ? roundInfo.priceForBusd : 0,

    inputValue: roundInfo ? roundInfo.minContributionForBusd : 0,
    inputMinValue: roundInfo ? roundInfo.minContributionForBusd : 0,
    inputMaxValue: roundInfo ? roundInfo.maxContributionForBusd : 0,
  });
  const [selectedTokenB, setSelectedTokenB] = useState<SelectedTokenB>({
    tokenName: "CTHR",
    tokenIcon: <DXCIconBG className="h-10 w-10" />,
    tokenBalance: 0,
    inputValue: roundInfo
      ? roundInfo.minContributionForBusd /
        Number(formatEther(roundInfo.priceForBusd.toString()))
      : 0,
  });

  const signer = getSigner();
  useEffect(() => {
    if (!connectedAddress || !signer || !roundInfo) return;
    setSelectedTokenA((prev) => ({
      ...prev,
      tokenName: "USDT",
      tokenIcon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/5">
          <USDTIcon />
        </span>
      ),
      minContribution: roundInfo?.minContributionForBusd,
      maxContribution: roundInfo?.maxContributionForBusd,
      rate: roundInfo?.priceForBusd,

      inputValue: roundInfo?.minContributionForBusd,
      inputMinValue: roundInfo?.minContributionForBusd,
      inputMaxValue: roundInfo?.maxContributionForBusd,
    }));
  }, [currentUserAddress, signer, roundInfo, connectedAddress]);

  // Get selectedTokenA balance
  useEffect(() => {
    if (!currentUserAddress || !signer) return;
    const getSelectedTokenBalance = async () => {
      getTokenBalance(
        selectedTokenA.tokenName,
        18,
        currentUserAddress,
        signer!
      ).then((tokenBalanace) =>
        setSelectedTokenA((prev) => ({
          ...prev,
          tokenBalance: tokenBalanace,
        }))
      );
    };
    getSelectedTokenBalance();
  }, [currentUserAddress, selectedTokenA.tokenName, signer]);

  // Get selectedTokenB balance
  useEffect(() => {
    if (!currentUserAddress || !signer) return;
    const getSelectedTokenBalance = async () => {
      getTokenBalance(
        selectedTokenB.tokenName,
        18,
        currentUserAddress,
        signer!
      ).then((tokenBalanace) =>
        setSelectedTokenB((prev) => ({
          ...prev,
          tokenBalance: tokenBalanace,
        }))
      );
    };
    getSelectedTokenBalance();
  }, [currentUserAddress, selectedTokenB.tokenName, signer]);

  useEffect(() => {
    if (signer == null && connectedAddress != null) {
      setConnectWalletModal(true);
    } else {
      setConnectWalletModal(false);
    }
  }, [signer, connectedAddress]);

  const checkSelectedTokenAllowance = useCallback(async () => {
    if (!connectedAddress || !signer) return;
    await getTokenAllowance(
      selectedTokenA.tokenName,
      connectedAddress,
      signer!
    );
  }, [connectedAddress, selectedTokenA.tokenName, signer]);

  // Get selected token allowance
  useEffect(() => {
    checkSelectedTokenAllowance();
  }, [checkSelectedTokenAllowance]);

  return (
    <div className="relative mt-4">
      <div className="my-4 flex w-fit items-center gap-5">
        <span
          className={clsx(
            "w-fit flex-shrink-0 cursor-pointer pb-2 font-semibold text-white",
            currentTab === "booking" && "myBox"
          )}
          onClick={() => setCurrentTab("booking")}
        >
          Booking
        </span>
        <span
          className={clsx(
            "w-fit flex-shrink-0 cursor-pointer pb-2 font-semibold text-white",
            currentTab === "details" && "myBox"
          )}
          onClick={() => setCurrentTab("details")}
        >
          Project Details
        </span>
      </div>
      {currentTab === "details" ? (
        <DetailsProject />
      ) : currentTab === "booking" ? (
        <BookingMain
          roundNo={roundNo}
          setRoundNo={setRoundNo}
          roundInfo={roundInfo}
          loadingState={loadingState}
          signer={getSigner()}
          contributionInfo={contributionInfo}
          refreshContributionInfo={refreshContributionInfo}
          setConnectWalletModal={setConnectWalletModal}
          connectedAddress={connectedAddress}
        />
      ) : null}
      <ConnectWalletModal
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        connectedAddress={connectedAddress}
        loggedInUser={loggedInUser}
        onClose={() => setConnectWalletModal(false)}
        open={connectWalletModal}
        authType="login"
      />
    </div>
  );
};
