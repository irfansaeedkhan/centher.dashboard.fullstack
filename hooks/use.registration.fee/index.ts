import useSWR from "swr";

import { axiosNodeApi } from "@/utils/axios";
import { Referral } from "@/models/referral";

const useRegistrationFee = () => {
  const { data, error } = useSWR(
    `/api/users/me/referral`,
    async (url) => {
      try {
        const { data } = await axiosNodeApi.get(url);
        const referral = data.referral_doc as Referral;

        if (referral.referred_by === null) {
          return Number(
            process.env.NEXT_PUBLIC_SIGNUP_REGISTRATION_FEE_BNB_WITHOUT_REFERRAL
          );
        } else {
          return Number(
            process.env.NEXT_PUBLIC_SIGNUP_REGISTRATION_FEE_BNB_WITH_REFERRAL
          );
        }
      } catch (error: any) {
        throw (
          error.response.data ?? {
            status: "error",
            message: "server_error",
            message_description: "Something went wrong",
          }
        );
      }
    },
    {
      onErrorRetry(err, _, _2, revalidate, { retryCount }) {
        if (err.message === "unauthenticated") {
          // Only retry up to 2 times if user is unauthenticated
          if (retryCount >= 2) {
            return;
          }
        }

        // Retry up to 5 times if there is any other error
        if (retryCount >= 5) {
          return;
        }

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  return {
    registrationFee: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useRegistrationFee;
