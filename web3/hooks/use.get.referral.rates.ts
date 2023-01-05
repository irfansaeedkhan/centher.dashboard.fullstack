import { useCallback, useEffect, useState } from "react";
import { getPresaleContract } from "../utils/contract.helpers";

export interface ReferralRates {
  rates: number[];
  companyAddress: string;
  coreTeamAddress: string;
  percentForCoreTeam: number;
}

export const useGetReferralRate = () => {
  const [referralRate, setReferralRate] = useState<ReferralRates>();
  const fetchReferralRateAndAddresses = useCallback(async () => {
    const presaleContract = getPresaleContract();
    const result = await presaleContract.getReferralRateAndAddresses();
    const _referralRate: ReferralRates = {
      rates: result._referralRate,
      companyAddress: result._companyAddress,
      coreTeamAddress: result._coreTeamAddress,
      percentForCoreTeam: result._percentForCoreTeam,
    };
    setReferralRate(_referralRate);
  }, []);

  useEffect(() => {
    fetchReferralRateAndAddresses();
  }, [fetchReferralRateAndAddresses]);

  return referralRate;
};
