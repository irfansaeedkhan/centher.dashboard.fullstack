import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getNTRContract } from "../utils/contract.helpers";

export const useVerificationTick = (address?: string) => {
  const [verificationIcon, setVerificationIcon] = useState("");

  useEffect(() => {
    if (!address) {
      return;
    }
    (async () => {
      const contract = getNTRContract();
      try {
        const ntrBalance = parseInt(
          ethers.utils.formatEther(await contract.balanceOf(address))
        );
        if (ntrBalance >= 5000 && ntrBalance < 25000) {
          setVerificationIcon("silver");
        } else if (ntrBalance >= 25000 && ntrBalance < 100000) {
          setVerificationIcon("gold");
        } else if (ntrBalance >= 100000) {
          setVerificationIcon("rainbow");
        } else {
          setVerificationIcon("no-icon");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [address]);
  return verificationIcon;
};
