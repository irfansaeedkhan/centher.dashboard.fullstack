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
        const normalizedData = convertAllBookingsToBUSD(data);
        setPreBookingStats(normalizedData);
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

const convertAllBookingsToBUSD = (input: PreBookingStats) => {
  if (!input) {
    return input;
  }

  if (input.bookings.my_bookings?.length) {
    input.bookings.my_bookings = input.bookings.my_bookings.map((e) => {
      if (e.payment_token_symbol.toLowerCase() != "busd") {
        const key = `${e.payment_token_symbol.toLowerCase()}BusdRate`;

        return {
          ...e,
          payment_token_amount: e.payment_token_amount * +input[key],
          payment_token_name: "BUSD Token",
          payment_token_symbol: "BUSD",
        };
      } else return e;
    });
  }

  if (input.bookings.recent_bookings?.length) {
    input.bookings.recent_bookings = input.bookings.recent_bookings.map((e) => {
      if (e.payment_token_symbol.toLowerCase() != "busd") {
        const key = `${e.payment_token_symbol.toLowerCase()}BusdRate`;

        return {
          ...e,
          payment_token_amount: e.payment_token_amount * +input[key],
          payment_token_name: "BUSD Token",
          payment_token_symbol: "BUSD",
        };
      } else return e;
    });
  }

  return input;
};
