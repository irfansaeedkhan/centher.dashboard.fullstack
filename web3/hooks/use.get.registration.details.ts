import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { SmartContractProvider } from "../blockchain/providers/smart.contract.provider";
import { SmartContractName } from "../blockchain/enum/smart.contract.name.enum";

export const useGetRegistrationDetail = (reload: boolean) => {
  const [registrationFees, setRegistrationFees] = useState({
    feeWithoutReferrer: 0,
    feeWithReferrer: 0.025,
  });
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const registrationContract = SmartContractProvider.getContract(
      SmartContractName.REGISTRATION
    );
    const fetchRegistrationDetail = async () => {
      setLoading(true);
      const _feeWithoutReferrer =
        await registrationContract.registrationFeeWithoutReferrer();
      const _feeWithReferrer =
        await registrationContract.registrationFeeWithReferrer();
      setRegistrationFees({
        feeWithoutReferrer: Number(
          ethers.utils.formatEther(_feeWithoutReferrer.toString())
        ),
        feeWithReferrer: Number(
          ethers.utils.formatEther(_feeWithReferrer.toString())
        ),
      });
      setLoading(false);
    };
    fetchRegistrationDetail();
    const fetchIsActive = async () => {
      const _pause = await registrationContract._pause();
      if (_pause) setIsActive(false);
      else setIsActive(true);
    };
    fetchIsActive();
  }, [reload]);

  return {
    registrationFees: registrationFees,
    isActive: isActive,
    loading: loading,
  };
};
