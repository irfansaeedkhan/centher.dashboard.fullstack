import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { OrgMember, PendingInvite } from "./types";

export const inviteOrgMember = async (newMember: {
  user_id: PendingInvite["user"]["_id"];
  title: PendingInvite["title"];
}): Promise<PendingInvite> => {
  try {
    const { data } = await axiosCIS.post<PendingInvite>(
      "/orgs/members/invites",
      newMember
    );

    return data;
  } catch (error: any) {
    const errorMessage = "Failed to add organization member";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "inviteOrgMember");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "inviteOrgMember"
      );
    }
  }
};
