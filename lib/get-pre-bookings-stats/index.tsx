import axios from "axios";

import { AppError } from "@/utils/app-error";

import { PreBookingStats } from "./types";

export const getPreBookingStats = async (
  userAccountAddress: string
): Promise<PreBookingStats> => {
  const endpoint = `${process.env.NEXT_PUBLIC_PRE_BOOKING_API_URL}/presale/statistics/${userAccountAddress}`;
  try {
    const { data } = await axios.get(endpoint);

    return data;
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not get pre-booking stats",
      "getPreBookingStats"
    );
  }
};
