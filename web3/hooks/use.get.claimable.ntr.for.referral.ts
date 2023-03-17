import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { SmartContractName } from "../blockchain/enum/smart.contract.name.enum";
import { SmartContractProvider } from "../blockchain/providers/smart.contract.provider";

export const useGetClaimableNtrForReferral = (
  account: string | undefined,
  reload?: boolean
) => {
  const [claimable, setClaimable] = useState(0);

  useEffect(() => {
    const fetchClaimable = async (account: string) => {
      try {
        const presaleContract = SmartContractProvider.getContract(
          SmartContractName.PRESALE
        );
        const _claimable = await presaleContract.refRewardByNTR(account);
        setClaimable(Number(ethers.utils.formatEther(_claimable.toString())));
      } catch (error) {
        console.error(error);
      }
    };
    if (account) {
      fetchClaimable(account);
    }
  }, [account, reload]);
  return claimable;
};
