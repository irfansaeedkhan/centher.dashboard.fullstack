import { NextRouter } from "next/router";
import toast from "react-hot-toast";

import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";

interface Params {
  trxHash: string;
  button: HTMLButtonElement;
  router: NextRouter;
}

export const listenRegistrationFeeTrxStatus = async ({
  trxHash,
  button,
  router,
}: Params) => {
  let reqCount = 0;

  const interval = setInterval(async () => {
    try {
      reqCount++;
      const { data } = await axiosNodeApi.get(
        `/api/auth/registration-fee-trx/${trxHash}`
      );

      if (data.trx_doc.trx_status === "success") {
        clearInterval(interval);
        button.disabled = false;
        router.push(AppRoutes.home);
        return;
      }

      if (data.trx_doc.trx_status === "error") {
        clearInterval(interval);
        button.disabled = false;
        toast.error("Transaction verification failed. Please contact support.");
        return;
      }

      if (reqCount >= 10) {
        clearInterval(interval);
        button.disabled = false;
        toast.error("Transaction verification failed. Please contact support.");
        return;
      }
    } catch (error: any) {
      clearInterval(interval);
      button.disabled = false;
      toast.error("Transaction verification failed. Please contact support.");
    }
  }, 5000);
};
