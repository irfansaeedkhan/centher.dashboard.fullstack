import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { OrgMember } from "./types";

export const getOrgMembers = async (): Promise<OrgMember[]> => {
  try {
    const { data } = await axiosCIS.get<{ members: OrgMember[] }>(
      "/orgs/members"
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
