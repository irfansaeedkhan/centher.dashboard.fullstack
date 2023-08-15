import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { OrgMember } from "./types";

export const addOrgMember = async (
  newMember: Pick<OrgMember, "user_id" | "title">
): Promise<OrgMember> => {
  try {
    const { data } = await axiosCIS.post<OrgMember>("/orgs/members", newMember);

    return data;
  } catch (error: any) {
    const errorMessage = "Failed to add organization member";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "addOrgMember");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "addOrgMember"
      );
    }
  }
};
