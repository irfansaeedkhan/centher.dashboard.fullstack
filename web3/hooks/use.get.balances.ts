import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SmartContractProvider } from "../blockchain/providers/smart.contract.provider";
import { SmartContractName } from "../blockchain/enum/smart.contract.name.enum";

export const useGetNtrBalance = (address: string | null | undefined) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!address) {
      return;
    }
    (async () => {
      const contract = SmartContractProvider.getContract(SmartContractName.NTR);
      try {
        const ntrBalance = ethers.utils.formatEther(
          await contract.balanceOf(address)
        );
        setBalance(Number(ntrBalance));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [address]);
  return balance;
};

export const useGetNtrDaoBalance = (address: string | null | undefined) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!address) {
      return;
    }
    (async () => {
      const contract = SmartContractProvider.getContract(SmartContractName.DXC);
      try {
        const ntrdaoBalance = ethers.utils.formatUnits(
          await contract.balanceOf(address),
          6
        );
        setBalance(Number(ntrdaoBalance));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [address]);
  return balance;
};

export const useGetBusdBalance = (address: string | null | undefined) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!address) {
      return;
    }
    (async () => {
      const contract = SmartContractProvider.getContract(
        SmartContractName.BUSD
      );
      try {
        const busdBalance = ethers.utils.formatEther(
          await contract.balanceOf(address)
        );
        setBalance(Number(busdBalance));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [address]);
  return balance;
};

export const useGetBNBBalance = (address: string | null | undefined) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!address) {
      return;
    }
    (async () => {
      try {
        const provider = ethers.getDefaultProvider(
          process.env.NEXT_PUBLIC_APP_ENV === "production" ? "bsc" : "goerli"
        );
        const bnbBalance = ethers.utils.formatEther(
          await provider.getBalance(address)
        );
        setBalance(Number(bnbBalance));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [address]);
  return balance;
};
