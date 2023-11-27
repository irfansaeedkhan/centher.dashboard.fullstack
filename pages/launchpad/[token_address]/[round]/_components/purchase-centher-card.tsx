import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
import Button from "@/components/button";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";
import DetailsProject from "@/pages/launchpad/pre-booking/_components/details-project";
import BookingMain from "@/pages/launchpad/pre-booking/_components/booking-main";
import { SelectedTokenA, SelectedTokenB } from "./types";
import { TimelinePeriod } from "./timeline-period";
interface Props {
  roundInfo: RoundInfo;
  currentUserAddress: string | undefined;
}

export const PurchaseCentherCard: React.FC<Props> = ({
  roundInfo,
  currentUserAddress,
}) => {
  const { user: loggedInUser } = useUser();
  const { connectedAddress, getSigner, disconnectWallet, connectWallet } =
    useWallet();
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    "rewards" | "details" | "booking"
  >("rewards");
  const { contributionInfo, refreshContributionInfo } = useGetContributionInfo(
    connectedAddress,
    roundInfo
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
    if (
      contributionInfo &&
      (contributionInfo.contributedBusdAmount > 0 ||
        contributionInfo.contributedNtrAmount > 0)
    ) {
      setCurrentTab("rewards");
    } else {
      setCurrentTab("details");
    }
  }, [contributionInfo]);

  useEffect(() => {
    if (signer == null && connectedAddress != null) {
      setConnectWalletModal(true);
    } else {
      setConnectWalletModal(false);
    }
  }, [signer, connectedAddress]);

  useEffect(() => {
    if (!signer || !roundInfo) return;
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
      <div className="my-4 flex items-center gap-2">
        {contributionInfo &&
          (contributionInfo.contributedBusdAmount > 0 ||
            contributionInfo.contributedNtrAmount > 0) && (
            <Button
              title="Claim Rewards"
              variant={currentTab === "rewards" ? "primary" : "secondary"}
              className="rounded-[10px]"
              onClick={() => setCurrentTab("rewards")}
            />
          )}
        <Button
          title="Project Details"
          variant={currentTab === "details" ? "primary" : "secondary"}
          className="rounded-[10px]"
          onClick={() => setCurrentTab("details")}
        />
        <Button
          title="Booking"
          variant={currentTab === "booking" ? "primary" : "secondary"}
          className="rounded-[10px]"
          onClick={() => setCurrentTab("booking")}
        />
      </div>
      {currentTab === "rewards" ? (
        contributionInfo &&
        (contributionInfo.contributedBusdAmount > 0 ||
          contributionInfo.contributedNtrAmount > 0) ? (
          <TimelinePeriod
            isBUSD={contributionInfo.contributedBusdAmount > 0}
            roundInfo={roundInfo}
            signer={signer!}
            contributionInfo={contributionInfo}
            refetchContributionInfo={refreshContributionInfo}
          />
        ) : !contributionInfo && signer ? (
          <div className="mt-5 flex w-full items-center justify-center">
            <Image
              src="/images/preloader.png"
              alt="Preloader"
              width={64}
              height={64}
              className="h-16 w-16 flex-shrink-0 object-cover"
            />
          </div>
        ) : (
          !connectedAddress && (
            <div className="mt-5 flex w-full items-center justify-center">
              <p className="text-xl font-semibold text-white">
                Please Connect your Wallet
              </p>
            </div>
          )
        )
      ) : currentTab === "details" ? (
        <DetailsProject />
      ) : currentTab === "booking" ? (
        <BookingMain />
      ) : null}
      {connectWalletModal && (
        <ConnectWalletModal
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          connectedAddress={connectedAddress}
          loggedInUser={loggedInUser}
          setConnectWalletModal={setConnectWalletModal}
        />
      )}
    </div>
  );
};
