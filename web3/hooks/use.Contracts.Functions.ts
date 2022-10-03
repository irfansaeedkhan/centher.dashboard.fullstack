import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {
  PurchasedInfoResponse,
  RoundInfo,
  RoundState,
} from "../constants/types";
import { getPresaleAddress } from "../utils/addressHelper";
import {
  getBusdContract,
  getNtrdaoContract,
  getPresaleContract,
  getRegisterContract,
} from "../utils/contractHelper";

export const useNtrdaoBalance = (account: string | undefined | null) => {
  const [balance, setBalance] = useState(0);
  const ntrdaoContract = getNtrdaoContract(null); //new Contract(dao_address, dao_abi, undefined);

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
  const busdContract = getBusdContract(null);
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

export const useBusdAllowance = (account: string | undefined | null) => {
  const [balance, setBalance] = useState(0);
  const busdContract = getBusdContract(null);
  useEffect(() => {
    const fetchBalance = async (account: string) => {
      const rawBalance = await busdContract.allowance(
        account,
        getPresaleAddress()
      );
      const value = ethers.utils.formatUnits(rawBalance.toString());
      setBalance(Number(value));
    };
    if (account) {
      fetchBalance(account);
    }
  }, [account]);

  return balance;
};

export const useGetRoundInfo = () => {
  const [balance, setBalance] = useState<RoundInfo[]>();
  const presaleContract = getPresaleContract(null);
  useEffect(() => {
    const fetchBalance = async () => {
      let _roundInfos = [];
      for (let i = 0; i < 3; i++) {
        const roundInfo = await presaleContract.roundInfo(i);
        const _roundInfo: RoundInfo = {
          price: Number(ethers.utils.formatUnits(roundInfo[0])),
          startTime: roundInfo[1].toNumber(),
          duration: roundInfo[2].toNumber(),
          bonusRate: roundInfo[3],
          lockMonths: roundInfo[4],
          busdRaised: Number(ethers.utils.formatUnits(roundInfo[5])),
          minContribution: Number(ethers.utils.formatUnits(roundInfo[6])),
          maxContribution: Number(ethers.utils.formatUnits(roundInfo[7])),
        };
        _roundInfos.push(_roundInfo);
      }
      setBalance(_roundInfos);
    };
    fetchBalance();
  }, []);

  return balance;
};

export const useGetPurchasedInfo = (
  account: string | undefined | null,
  reload: boolean
) => {
  const [purchasedInfo, setPurchasedInfo] = useState<PurchasedInfoResponse[][]>(
    []
  );
  const presaleContract = getPresaleContract(null);
  useEffect(() => {
    const fetchPurchasedInfo = async (account: string) => {
      let _purchasedInfos = [];
      for (let i = 0; i < 3; i++) {
        const purchasedInfoByRound = await presaleContract.getContribute(
          account,
          i
        );
        const purchasedInfo = purchasedInfoByRound.map((item: any) => {
          var date = new Date(item[1] * 1000);
          return {
            purchasedDate: item[1].toNumber(),
            contributedBusdAmount: Number(ethers.utils.formatUnits(item[0])),
            claimedAmount: Number(ethers.utils.formatUnits(item[2])),
          };
        });
        _purchasedInfos.push(purchasedInfo);
      }
      setPurchasedInfo(_purchasedInfos);
    };
    if (account) fetchPurchasedInfo(account);
  }, [account, reload]);

  return purchasedInfo;
};

export const useRoundState = () => {
  const [roundState, setRoundState] = useState<RoundState>(RoundState.Undefind);
  const presaleContract = getPresaleContract(null);
  useEffect(() => {
    const fetchRoundState = async () => {
      const _roundState = await presaleContract.getRound();
      setRoundState(_roundState);
    };
    fetchRoundState();
  }, []);

  return roundState;
};

export const useIsRegistered = (account: string | undefined | null) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const registerContract = getRegisterContract(null);
  useEffect(() => {
    const fetchIsRegistered = async (account: string) => {
      const _isRegistered = await registerContract.isUserRegisteredWithAddress(
        account
      );
      setIsRegistered(_isRegistered);
    };
    if (account) fetchIsRegistered(account);
  }, [account]);
  return isRegistered;
};
