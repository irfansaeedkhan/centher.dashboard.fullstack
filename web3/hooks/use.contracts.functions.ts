import { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import dayjs from "dayjs";

import { customLog } from "@/utils/custom.log";

import {
  getMarketplaceAddress,
  getPresaleAddress,
} from "../utils/address.helpers";
import {
  getBusdContract,
  getNTRContract,
  getPresaleContract,
  getStandardNFTContract,
} from "../utils/contract.helpers";
import { getTokenContract, TokenName } from "../utils/call.helpers";
import {
  ContributionInfo,
  RoundInfo,
  RoundNumber,
  RoundState,
  RoundStatus,
} from "../constants/types";
import { ZeroAddress } from "../constants/common";

export const useGetRoundsInfo = () => {
  const [roundsInfo, setRoundsInfo] = useState<RoundInfo[]>([]);
  const presaleContract = useMemo(() => getPresaleContract(), []);

  useEffect(() => {
    const fetchRoundsInfo = async () => {
      const roundState = await getRoundState();

      let _roundInfos = [];
      for (let i = 0; i < 3; i++) {
        const roundInfo = await presaleContract.roundInfo(i);
        const roundStatus = getRoundStatus(roundState, i);

        const _roundInfo: RoundInfo = {
          round: i as RoundNumber,
          status: roundStatus,
          rateForBusd: roundInfo["rateForBusd"].toNumber() / 100,
          rateForNtr: roundInfo["rateForNtr"].toNumber() / 100,
          busdRaised: Number(ethers.utils.formatUnits(roundInfo["busdRaised"])),
          ntrRaised: Number(ethers.utils.formatUnits(roundInfo["ntrRaised"])),
          startTime: roundInfo["startTime"].toNumber(),
          duration: roundInfo["duration"].toNumber(),
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
    };
    try {
      fetchRoundsInfo();
    } catch (error: any) {
      customLog("useGetRoundsInfo", ["development"]);
      customLog(error, ["development"]);
      setRoundsInfo([]);
    }
  }, [presaleContract]);

  return roundsInfo;
};

export const getRoundState = async () => {
  const presaleContract = getPresaleContract();
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
  const presaleContract = useMemo(() => getPresaleContract(), []);

  const fetchContributionInfo = useCallback(
    async (account: string) => {
      const contributionInfoRes = await presaleContract.getContribute(
        account,
        roundInfo.round
      );

      const claimedTokenAmountForBusd = Number(
        ethers.utils.formatUnits(
          contributionInfoRes["claimedTokenAmountForBusd"],
          6
        )
      );

      const claimedTokenAmountForNtr = Number(
        ethers.utils.formatUnits(
          contributionInfoRes["claimedTokenAmountForNtr"],
          6
        )
      );

      const totalClaimableTokenAmountForBusd = Number(
        ethers.utils.formatUnits(
          contributionInfoRes["totalClaimableTokenAmountForBusd"],
          6
        )
      );

      const totalClaimableTokenAmountForNtr = Number(
        ethers.utils.formatUnits(
          contributionInfoRes["totalClaimableTokenAmountForNtr"],
          6
        )
      );

      // If claimedTokenAmountForBusd is greater or equal to totalClaimableTokenAmountForBusd, then user has claimed all tokens
      const hasClaimedAllForBusd = contributionInfoRes[
        "claimedTokenAmountForBusd"
      ].gte(contributionInfoRes["totalClaimableTokenAmountForBusd"]);

      // If claimedTokenAmountForNtr is greater or equal to totalClaimableTokenAmountForNtr, then user has claimed all tokens
      const hasClaimedAllForNtr = contributionInfoRes[
        "claimedTokenAmountForNtr"
      ].gte(contributionInfoRes["totalClaimableTokenAmountForNtr"]);

      const _contributionInfo: ContributionInfo = {
        contributedBusdAmount: Number(
          ethers.utils.formatUnits(contributionInfoRes["contributedBusdAmount"])
        ),
        contributedNtrAmount: Number(
          ethers.utils.formatUnits(contributionInfoRes["contributedNtrAmount"])
        ),
        purchaseTimeForBusd:
          contributionInfoRes["purchaseTimeForBusd"].toNumber() === 0
            ? "0"
            : dayjs(
                new Date(
                  contributionInfoRes["purchaseTimeForBusd"].toNumber() * 1000
                )
              ).format("DD-MM-YYYY"),
        purchaseTimeForNtr:
          contributionInfoRes["purchaseTimeForNtr"].toNumber() === 0
            ? "0"
            : dayjs(
                new Date(
                  contributionInfoRes["purchaseTimeForNtr"].toNumber() * 1000
                )
              ).format("DD-MM-YYYY"),
        claimedTokenAmountForBusd,
        claimedTokenAmountForNtr,
        totalClaimableTokenAmountForBusd,
        totalClaimableTokenAmountForNtr,
        hasClaimedAllForBusd,
        hasClaimedAllForNtr,
        // If lockMonths have passed since purchaseTimeForBusd, then user can claim tokens
        isClaimableForBusd:
          !hasClaimedAllForBusd &&
          isClaimable(
            contributionInfoRes["purchaseTimeForBusd"],
            roundInfo.lockMonths
          ),
        // If lockMonths have passed since purchaseTimeForNtr, then user can claim tokens
        isClaimableForNtr:
          !hasClaimedAllForNtr &&
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
    if (account) fetchContributionInfo(account);
  }, [account, fetchContributionInfo]);

  const refreshContributionInfo = useCallback(async () => {
    if (account) fetchContributionInfo(account);
  }, [account, fetchContributionInfo]);

  return { contributionInfo, refreshContributionInfo };
};

const isClaimable = (purchaseTime: BigNumber, lockMonths: number) => {
  return process.env.APP_ENV !== "production"
    ? dayjs(new Date(purchaseTime.toNumber() * 1000))
        .add(lockMonths * 5, "minutes") // For testing 1 month is considered as 5 minutes
        .isBefore(dayjs())
    : dayjs(new Date(purchaseTime.toNumber() * 1000))
        .add(lockMonths, "months")
        .isBefore(dayjs());
};

export const getTokenBalance = async (
  tokenName: TokenName,
  account: string,
  library: Web3Provider
) => {
  const tokenContract = getTokenContract(tokenName, library);
  if (!tokenContract) return 0;

  const balance = Number(
    ethers.utils.formatUnits(await tokenContract.balanceOf(account))
  );
  return balance;
};

export const getTokenAllowance = async (
  tokenName: TokenName,
  account: string,
  library: Web3Provider
) => {
  const tokenContract = getTokenContract(tokenName, library);
  if (!tokenContract) return 0;

  const allowance = Number(
    ethers.utils.formatUnits(
      await tokenContract.allowance(account, getPresaleAddress())
    )
  );
  return allowance;
};

export const useGetApprovedForAll = (
  account: string | null | undefined,
  collection: string | undefined
) => {
  const [approve, setApprove] = useState(false);
  const marketplaceAddress = getMarketplaceAddress();

  useEffect(() => {
    const fetchReferrers = async (account: string, collection: string) => {
      const nftContract = getStandardNFTContract(null, collection);
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
  tokenId: number | undefined,
  ownerOfListed: string | undefined
) => {
  const [owner, setOwner] = useState("");

  useEffect(() => {
    const fetchOwner = async (
      tokenId: number,
      collection: string,
      ownerOfListed: string
    ) => {
      if (ownerOfListed === ZeroAddress) {
        const nftContract = getStandardNFTContract(null, collection);
        const _owner = await nftContract.ownerOf(tokenId);
        setOwner(_owner);
      } else {
        setOwner(ownerOfListed);
      }
    };

    if (tokenId && collection && ownerOfListed) {
      fetchOwner(tokenId, collection, ownerOfListed);
    }
  }, [tokenId, collection, ownerOfListed]);
  return owner;
};
