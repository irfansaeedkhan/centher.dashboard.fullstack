import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

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
import {
  PurchasedInfoResponse,
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

export const useGetPurchasedInfo = (
  account: string | undefined | null,
  reload: boolean
) => {
  const [purchasedInfo, setPurchasedInfo] = useState<PurchasedInfoResponse[]>(
    []
  );
  const presaleContract = useMemo(() => getPresaleContract(), []);

  useEffect(() => {
    const fetchPurchasedInfo = async (account: string) => {
      let _purchasedInfos: PurchasedInfoResponse[] = [];
      for (let i = 0; i < 3; i++) {
        const purchasedInfoByRound = await presaleContract.getContribute(
          account,
          i
        );

        console.log("purchasedInfo from contract");
        console.log(purchasedInfoByRound);
        const _purchasedInfo: PurchasedInfoResponse = {
          contributedBusdAmount: Number(
            ethers.utils.formatUnits(
              purchasedInfoByRound["contributedBusdAmount"]
            )
          ),
          contributedNtrAmount: Number(
            ethers.utils.formatUnits(
              purchasedInfoByRound["contributedNtrAmount"]
            )
          ),
          claimedTokenAmount: Number(
            ethers.utils.formatUnits(purchasedInfoByRound["claimedTokenAmount"])
          ),
          purchaseTime: purchasedInfoByRound["purchaseTime"].toNumber(),
          totalClaimableTokenAmount: Number(
            ethers.utils.formatUnits(
              purchasedInfoByRound["totalClaimableTokenAmount"]
            )
          ),
        };

        _purchasedInfos.push(_purchasedInfo);
      }

      setPurchasedInfo(_purchasedInfos);
    };
    if (account) fetchPurchasedInfo(account);
  }, [account, reload, presaleContract]);

  return purchasedInfo;
};

export type TokenName = "BUSD" | "NTR" | "NTRDAO";

export const getTokenContract = (
  tokenName: TokenName,
  library: Web3Provider | JsonRpcSigner
) => {
  if (tokenName === "BUSD") {
    return getBusdContract(library);
  } else if (tokenName === "NTR") {
    return getNTRContract(library);
  }
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
