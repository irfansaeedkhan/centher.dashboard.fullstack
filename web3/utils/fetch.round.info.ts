import { useEffect, useState } from "react";
import { ethers } from "ethers";

import useRefresh from "../hooks/use.refresh";
import presaleABI from "../abis/presale.json";

import { multicall } from "./multi.call";
import { AddressFactory } from "../blockchain/providers/address.provider";
import { SmartContractName } from "../blockchain/enum/smart.contract.name.enum";

interface RoundInfo {
  price: number;
  startTime: number;
  duration: number;
  bonusRate: number;
  lockMonths: number;
  busdRaised: number;
  minContribution: number;
  maxContribution: number;
}

export const fetchRoundData = async () => {
  const calls = [];
  const presaleAddress = AddressFactory.getContractAddress(
    SmartContractName.PRESALE
  );
  for (let i = 0; i < 3; i++) {
    const callData = {
      address: presaleAddress,
      name: "roundInfo",
      params: [i],
    };
    calls.push(callData);
  }

  const rawRoundData = await multicall(presaleABI, calls);
  const parsedRoundData = rawRoundData.map((item: any, ind: number) => {
    return {
      price: ethers.utils.formatUnits(item[0], 18),
      startTime: item[1].toNumber(),
      duration: item[2].toNumber(),
      bonusRate: item[3].toNumber(),
      lockMonths: item[4].toNumber(),
      busdRaised: ethers.utils.formatUnits(item[5], 18),
      minContribution: ethers.utils.formatUnits(item[6], 18),
      maxContribution: ethers.utils.formatUnits(item[7], 18),
    };
  });
  return parsedRoundData;
};

export const useRoundInfo = () => {
  const [roundInfo, setRoundInfo] = useState<RoundInfo[]>();
  const { slowRefresh, fastRefresh } = useRefresh();
  useEffect(() => {
    const fetchRoundInfo = async () => {
      const _roundInfo = await fetchRoundData();
      setRoundInfo(_roundInfo);
    };
    fetchRoundInfo();
  }, [fastRefresh]);
  return roundInfo;
};
