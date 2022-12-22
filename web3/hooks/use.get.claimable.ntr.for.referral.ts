import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getPresaleContract } from "../utils/contract.helpers";

export const useGetClaimableNtrForReferral = (
  account: string | undefined,
  reload?: boolean
) => {
  const [claimable, setClaimable] = useState(0);

  useEffect(() => {
    const fetchClaimable = async (account: string) => {
      try {
        const presale = getPresaleContract();
        const _claimable = await presale.refRewardByNTR(account);
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
