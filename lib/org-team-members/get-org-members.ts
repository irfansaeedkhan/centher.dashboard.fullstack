import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { OrgMember } from "./types";

export const getOrgMembers = async (orgId: string): Promise<OrgMember[]> => {
  try {
    const { data } = await axiosCIS.get<{ members: OrgMember[] }>(
      `/api/orgs/members/${orgId}`
    );

    return data.members;
  } catch (error: any) {
    const errorMessage = "Failed to get organization members";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "getOrgMembers");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getOrgMembers"
      );
    }
  }
};
