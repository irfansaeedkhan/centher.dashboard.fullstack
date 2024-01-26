import { useCallback, useEffect, useState } from "react";
import {
  AutoRestakeStatus,
  ToggleAutoRestakeStatusParams,
  getAutoRestakeStatus,
  toggleAutoRestakeStatus,
} from "@/lib/staking";
import { customLog } from "@/utils/custom.log";

export const useAutoRestake = (poolId: number | string | undefined) => {
  const [autoRestakeStatus, setAutoRestakeStatus] =
    useState<AutoRestakeStatus | null>(null);

  useEffect(() => {
    getAutoRestakeStatus()
      .then((status) => setAutoRestakeStatus(status))
      .catch((err: any) => {
        customLog(["development", "staging"], err);
      });
  }, []);

  const handleToggleAutoRestake = useCallback(
    async (data: ToggleAutoRestakeStatusParams) => {
      const response = await toggleAutoRestakeStatus(data);
      setAutoRestakeStatus(response);
    },
    []
  );

  return {
    isAutoRestakeEnabled:
      poolId != null && autoRestakeStatus != null
        ? autoRestakeStatus.auto_restake.includes(+poolId)
        : false,
    autoRestakeStatus,
    handleToggleAutoRestake,
  };
};
