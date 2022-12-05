import { useEffect, useMemo, useState } from "react";

import { ethers } from "ethers";
import {
  PurchasedInfoResponse,
  RoundInfo,
  RoundState,
} from "../constants/types";
import {
  getMarketplaceAddress,
  getPresaleAddress,
} from "../utils/address.helpers";
import {
  getBusdContract,
  getNTRContract,
  getNtrdaoContract,
  getPresaleContract,
  getRegistrationContract,
  getStandardNFTContract,
} from "../utils/contract.helpers";
import { ZeroAddress } from "../constants/common";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

export const useNtrdaoBalance = (account: string | undefined | null) => {
  const [balance, setBalance] = useState(0);
  const ntrdaoContract = useMemo(() => getNtrdaoContract(), []);

  useEffect(() => {
    const fetchBalance = async (account: string) => {
      const rawBalance = await ntrdaoContract.balanceOf(account);
      const value = ethers.utils.formatUnits(rawBalance.toString(), 6);
      setBalance(Number(value));
    };
    if (account) {
      fetchBalance(account);
    }
  }, [account, ntrdaoContract]);

  return balance;
};

export const useBusdBalance = (
  account: string | undefined | null,
  reload: boolean
) => {
  const [balance, setBalance] = useState(0);
  const busdContract = getBusdContract();
  useEffect(() => {
    const fetchBalance = async (account: string) => {
      const rawBalance = await busdContract.balanceOf(account);
      const value = ethers.utils.formatUnits(rawBalance.toString(), 18);
      setBalance(Number(value));
    };
    if (account) {
      fetchBalance(account);
    }
  }, [account, reload]);

  return balance;
};

export const useGetBusdAllowance = (account: string | undefined | null) => {
  const [allowance, setBalance] = useState(0);
  const busdContract = useMemo(() => getBusdContract(), []);
  useEffect(() => {
    const fetchAllowance = async (account: string) => {
      const rawBalance = await busdContract.allowance(
        account,
        getPresaleAddress()
      );
      const value = ethers.utils.formatUnits(rawBalance.toString());
      setBalance(Number(value));
    };
    if (account) {
      fetchAllowance(account);
    }
  }, [account, busdContract]);

  return allowance;
};

export const useGetRoundInfo = () => {
  const [balance, setBalance] = useState<RoundInfo[]>();
  const presaleContract = useMemo(() => getPresaleContract(), []);

  useEffect(() => {
    const fetchBalance = async () => {
      let _roundInfos = [];
      for (let i = 0; i < 3; i++) {
        const roundInfo = await presaleContract.roundInfo(i);
        console.log("roundInfo from contract");

        const _roundInfo: RoundInfo = {
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
      setBalance(_roundInfos);
    };
    fetchBalance();
  }, [presaleContract]);

  return balance;
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

export const useGetRoundState = () => {
  const [roundState, setRoundState] = useState<RoundState>(
    RoundState.RoundsNotStarted
  );
  const presaleContract = useMemo(() => getPresaleContract(), []);
  useEffect(() => {
    const fetchRoundState = async () => {
      const _roundState = await presaleContract.getRound();
      setRoundState(_roundState);
    };
    fetchRoundState();
  }, [presaleContract]);

  return roundState;
};

export const useIsRegistered = (account: string | undefined | null) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const registerContract = getRegistrationContract();

  useEffect(() => {
    const fetchIsRegistered = async (account: string) => {
      const _isRegistered = await registerContract.isUserRegisteredWithAddress(
        account
      );
      setIsRegistered(_isRegistered);
    };

    if (account) {
      fetchIsRegistered(account);
    }
  }, [account, registerContract]);
  return isRegistered;
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

export type TokenName = "BUSD" | "NTR" | "NTRDAO";
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
