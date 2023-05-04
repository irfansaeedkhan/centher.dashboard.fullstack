import { useEffect, useState } from "react";

import { getPreBookingStats } from "@/lib/get-pre-bookings-stats";
import { PreBookingStats } from "@/lib/get-pre-bookings-stats/types";
import { LoadingState } from "@/models/common";

export const usePreBookingStats = (userAccountAddress: string | undefined) => {
  const [preBookingStats, setPreBookingStats] =
    useState<PreBookingStats | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    if (!userAccountAddress) return;

    (async () => {
      try {
        setLoading("loading");
        const data = await getPreBookingStats(userAccountAddress);
        setPreBookingStats(data);
        setLoading("loaded");
      } catch (err) {
        setLoading("failed");
        setPreBookingStats(null);
      }
    })();
  }, [userAccountAddress]);

  return {
    preBookingStats,
    loading,
  };
};
