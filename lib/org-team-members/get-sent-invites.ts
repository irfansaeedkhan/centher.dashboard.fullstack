import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { PendingInvite } from "./types";

export const getSentInvites = async (): Promise<PendingInvite[]> => {
  try {
    const { data } = await axiosCIS.get<PendingInvite[]>(
      `/api/orgs/members/invites/sent`
    );

    return data;
  } catch (error: any) {
    const errorMessage = "Failed to get sent invites";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "getSentInvites");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getSentInvites"
      );
    }
  }
};
