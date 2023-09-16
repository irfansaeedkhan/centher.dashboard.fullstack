import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { PendingInvite } from "./types";

export const getReceivedInvites = async (): Promise<PendingInvite[]> => {
  try {
    const { data } = await axiosCIS.get<PendingInvite[]>(
      `/orgs/members/invites/received`
    );

    return data;
  } catch (error: any) {
    const errorMessage = "Failed to get received invites";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "getReceivedInvites");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getReceivedInvites"
      );
    }
  }
};
