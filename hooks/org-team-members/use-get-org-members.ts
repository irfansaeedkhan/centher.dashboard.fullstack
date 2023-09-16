import { useCallback, useEffect, useState } from "react";
import { getOrgMembers } from "@/lib/org-team-members";
import { LoadingState } from "@/models/common";
import { customLog } from "@/utils/custom.log";
import { OrgMember } from "./types";

export const useGetOrgMembers = (
  orgId: string | undefined
): {
  loading: LoadingState;
  orgMembers: OrgMember[];
  removeOrgMember: (userId: string) => void;
} => {
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);

  const fetchOrgMembers = useCallback(async () => {
    if (!orgId) return;
    try {
      setLoading("loading");
      const _orgMembers = await getOrgMembers(orgId);
      setOrgMembers(_orgMembers);
      setLoading("loaded");
    } catch (err: any) {
      customLog(["development", "staging"], err);
      setLoading("failed");
    }
  }, [orgId]);

  useEffect(() => {
    fetchOrgMembers();
  }, [fetchOrgMembers]);

  const removeOrgMember = useCallback((userId: string) => {
    setOrgMembers((prev) => prev.filter((member) => member.user_id !== userId));
  }, []);

  return {
    loading,
    orgMembers,
    removeOrgMember,
  };
};
