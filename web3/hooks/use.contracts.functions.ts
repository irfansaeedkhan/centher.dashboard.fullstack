import { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import dayjs from "dayjs";

import { customLog } from "@/utils/custom.log";
import { TokenName } from "../blockchain/types";
import {
  ContributionInfo,
  RoundInfo,
  RoundNumber,
  RoundState,
  RoundStatus,
} from "../constants/types";
import { AddressFactory } from "../blockchain/providers/address.provider";
import { SmartContractName } from "../blockchain/enum/smart.contract.name.enum";
import { SmartContractProvider } from "../blockchain/providers/smart.contract.provider";

export const useGetRoundsInfo = () => {
  const [roundsInfo, setRoundsInfo] = useState<RoundInfo[]>([]);
  const presaleContract = useMemo(
    () => SmartContractProvider.getContract(SmartContractName.PRESALE),
    []
  );

  const fetchRoundsInfo = useCallback(async () => {
    try {
      const roundState = await getRoundState();
      let _roundInfos = [];
      for (let i = 0; i < 3; i++) {
        const roundInfo = await presaleContract.roundInfo(i);

        const roundStatus = getRoundStatus(roundState, i);

        const _roundInfo: RoundInfo = {
          round: i as RoundNumber,
          status: roundStatus,
          // priceForBusd: roundInfo["priceForBusd"].toNumber() / 100000,
          //   priceForNtr: roundInfo["priceForNtr"].toNumber() / 100000,
          priceForBusd: roundInfo["priceForBusd"].toString(),
          priceForNtr: roundInfo["priceForNtr"].toString(),
          busdRaised: Number(ethers.utils.formatUnits(roundInfo["busdRaised"])),
          ntrRaised: Number(ethers.utils.formatUnits(roundInfo["ntrRaised"])),
          startTime: roundInfo["startTime"].toNumber(),
          endTime: roundInfo["endTime"].toNumber(),
          maxCentherAmountToSell: Number(
            ethers.utils.formatEther(roundInfo["maxDexaAmountToSell"])
          ),
          busdEnabled: roundInfo["busdEnabled"],
          ntrEnabled: roundInfo["ntrEnabled"],
          lockMonths: roundInfo["lockMonths"],
          minContributionForBusd: Number(
            ethers.utils.formatUnits(roundInfo["minContributionForBusd"])
          ),
          maxContributionForBusd: Number(
            ethers.utils.formatUnits(roundInfo["maxContributionForBusd"])
          ),
          minContributionForNtr: Number(
            ethers.utils.formatUnits(roundInfo["minContributionForNtr"])
          ),
          maxContributionForNtr: Number(
            ethers.utils.formatUnits(roundInfo["maxContributionForNtr"])
          ),
        };
        _roundInfos.push(_roundInfo);
      }
      setRoundsInfo(_roundInfos);
    } catch (error: any) {
      customLog(["development"], "useGetRoundsInfo: ", error);
      setRoundsInfo([]);
    }
  }, [presaleContract]);

  useEffect(() => {
    fetchRoundsInfo();
  }, [fetchRoundsInfo]);

  return {
    roundsInfo,
    refreshRoundsInfo: fetchRoundsInfo,
  };
};

export const getRoundState = async () => {
  const presaleContract = SmartContractProvider.getContract(
    SmartContractName.PRESALE
  );
  return (await presaleContract.getRound()) as RoundState;
};

export const getRoundStatus = (
  roundState: RoundState,
  round: number
): RoundStatus => {
  if (round === 0) {
    return roundState === RoundState.RoundsNotStarted
      ? "not-started"
      : roundState === RoundState.Round1Started
      ? "active"
      : roundState > RoundState.Round1Started ||
        roundState <= RoundState.Round2NotStarted
      ? "ended"
      : undefined;
  } else if (round === 1) {
    return roundState <= RoundState.Round1Started &&
      roundState >= RoundState.Round2NotStarted
      ? "not-started"
      : roundState === RoundState.Round2Started
      ? "active"
      : roundState > RoundState.Round2Started ||
        roundState <= RoundState.Round3NotStarted
      ? "ended"
      : undefined;
  } else if (round === 2) {
    return roundState <= RoundState.Round2Started &&
      roundState >= RoundState.Round3NotStarted
      ? "not-started"
      : roundState === RoundState.Round3Started
      ? "active"
      : roundState <= RoundState.RoundsEnded
      ? "ended"
      : undefined;
  }

  return undefined;
};

export const useGetContributionInfo = (
  account: string | undefined | null,
  roundInfo: RoundInfo
) => {
  const [contributionInfo, setPurchasedInfo] =
    useState<ContributionInfo | null>(null);
  const presaleContract = useMemo(
    () => SmartContractProvider.getContract(SmartContractName.PRESALE),
    []
  );

  const fetchContributionInfo = useCallback(
    async (account: string) => {
      const contributionInfoRes = await presaleContract.getContribute(
        account,
        roundInfo?.round
      );

      const claimedTokenAmountForBusd = Number(
        ethers.utils.formatUnits(
          contributionInfoRes["claimedTokenAmountForBusd"]
        )
      );

      const claimedTokenAmountForNtr = Number(
        ethers.utils.formatUnits(
          contributionInfoRes["claimedTokenAmountForNtr"]
        )
      );

      const totalClaimableTokenAmountForBusd = Number(
        ethers.utils.formatUnits(
          contributionInfoRes["totalClaimableTokenAmountForBusd"]
        )
      );

      const totalClaimableTokenAmountForNtr = Number(
        ethers.utils.formatUnits(
          contributionInfoRes["totalClaimableTokenAmountForNtr"]
        )
      );

      // Get Claimable Amount Now For BUSD
      const claimableTokenAmountForBusd = Number(
        ethers.utils.formatUnits(
          await presaleContract.getClaimableTokenAmountFromBusd(
            roundInfo.round,
            account
          )
        )
      );

      // Get Claimable Amount Now For NTR
      const claimableTokenAmountForNtr = Number(
        ethers.utils.formatUnits(
          await presaleContract.getClaimableTokenAmountFromNtr(
            roundInfo.round,
            account
          )
        )
      );

      const _contributionInfo: ContributionInfo = {
        contributedBusdAmount: Number(
          ethers.utils.formatUnits(contributionInfoRes["contributedBusdAmount"])
        ),
        contributedNtrAmount: Number(
          ethers.utils.formatUnits(contributionInfoRes["contributedNtrAmount"])
        ),
        purchaseTimeForBusd:
          contributionInfoRes["purchaseTimeForBusd"].toNumber() === 0
            ? 0
            : Number(contributionInfoRes["purchaseTimeForBusd"]),
        purchaseTimeForNtr:
          contributionInfoRes["purchaseTimeForNtr"].toNumber() === 0
            ? 0
            : Number(contributionInfoRes["purchaseTimeForNtr"]),
        claimedTokenAmountForBusd,
        claimedTokenAmountForNtr,
        totalClaimableTokenAmountForBusd,
        totalClaimableTokenAmountForNtr,
        claimableTokenAmountForBusd,
        claimableTokenAmountForNtr,
        // If lockMonths have passed since purchaseTimeForBusd, then user can claim tokens
        isClaimableForBusd:
          claimableTokenAmountForBusd > 0 &&
          isClaimable(
            contributionInfoRes["purchaseTimeForBusd"],
            roundInfo.lockMonths
          ),
        // If lockMonths have passed since purchaseTimeForNtr, then user can claim tokens
        isClaimableForNtr:
          claimableTokenAmountForNtr > 0 &&
          isClaimable(
            contributionInfoRes["purchaseTimeForNtr"],
            roundInfo.lockMonths
          ),
      };

      setPurchasedInfo(_contributionInfo);
    },
    [presaleContract, roundInfo]
  );

  useEffect(() => {
    if (account && roundInfo) fetchContributionInfo(account);
  }, [account, fetchContributionInfo, roundInfo]);

  const refreshContributionInfo = useCallback(async () => {
    if (account) fetchContributionInfo(account);
  }, [account, fetchContributionInfo]);

  return { contributionInfo, refreshContributionInfo };
};

const isClaimable = (purchaseTime: BigNumber, lockMonths: number) => {
  return process.env.NEXT_PUBLIC_APP_ENV !== "production"
    ? dayjs(new Date(purchaseTime.toNumber() * 1000))
        .add(lockMonths * 5, "minutes") // For testing 1 month is considered as 5 minutes
        .isBefore(dayjs())
    : dayjs(new Date(purchaseTime.toNumber() * 1000))
        .add(lockMonths, "months")
        .isBefore(dayjs());
};

export const getTokenBalance = async (
  tokenName: TokenName,
  tokenDecimals: number,
  account: string,
  library: JsonRpcSigner
) => {
  const tokenContract = SmartContractProvider.getTokenContract(
    tokenName,
    library
  );
  if (!tokenContract) return 0;

  const balance = Number(
    ethers.utils.formatUnits(
      await tokenContract.balanceOf(account),
      tokenDecimals
    )
  );
  return balance;
};

export const getTokenAllowance = async (
  tokenName: TokenName,
  account: string,
  library: JsonRpcSigner
) => {
  const tokenContract = SmartContractProvider.getTokenContract(
    tokenName,
    library
  );
  if (!tokenContract) return 0;
  const presaleContractAddress = AddressFactory.getContractAddress(
    SmartContractName.PRESALE
  );
  const allowance = Number(
    ethers.utils.formatUnits(
      await tokenContract.allowance(account, presaleContractAddress)
    )
  );
  return allowance;
};

export const useGetApprovedForAll = (
  account: string | null | undefined,
  collection: string | undefined
) => {
  const [approve, setApprove] = useState(false);
  const marketplaceAddress = AddressFactory.getContractAddress(
    SmartContractName.MARKETPALCE
  );

  useEffect(() => {
    const fetchReferrers = async (account: string, collection: string) => {
      const nftContract = SmartContractProvider.getNFTContract(collection);
      const _approve = await nftContract.isApprovedForAll(
        account,
        marketplaceAddress
      );
      setApprove(_approve);
    };

    if (account && collection) {
      fetchReferrers(account, collection);
    }
  }, [account, collection, marketplaceAddress]);
  return approve;
};

export const useGetNFTOwner = (
  collection: string | undefined,
  tokenId: number | undefined
) => {
  const [owner, setOwner] = useState("");

  useEffect(() => {
    const fetchOwner = async (tokenId: number, collection: string) => {
      const nftContract = SmartContractProvider.getNFTContract(collection);
      const _owner = await nftContract.ownerOf(tokenId);
      setOwner(_owner);
    };

    if (tokenId && collection) {
      fetchOwner(tokenId, collection);
    }
  }, [tokenId, collection]);
  return owner;
};
