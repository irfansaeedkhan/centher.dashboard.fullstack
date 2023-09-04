import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { customLog } from "@/utils/custom.log";
import { LoadingState } from "@/models/common";
import { OrgMember, getOrgMembers } from "@/lib/org-team-members";
import TeamMember from "./team-member";

const TeamMembersPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);

  const fetchOrgMembers = useCallback(async () => {
    if (!router.query.user_id) return;
    try {
      setLoading("loading");
      const _orgMembers = await getOrgMembers(router.query.user_id?.toString());
      setOrgMembers(_orgMembers);
      setLoading("loaded");
    } catch (err: any) {
      customLog(["development", "staging"], err);
      setLoading("failed");
    }
  }, [router.query.user_id]);

  useEffect(() => {
    fetchOrgMembers();
  }, [fetchOrgMembers]);

  return (
    <>
      {loading === "loaded" && orgMembers.length > 0 && (
        <div className="grid grid-cols-1 gap-4 f2xl:grid-cols-2">
          {orgMembers.map((member) => {
            return (
              <TeamMember key={member.user_id} member={member} className="" />
            );
          })}
        </div>
      )}

      {loading === "loaded" && orgMembers.length === 0 && (
        <div className="mt-6 flex justify-center text-sm font-medium text-gray-shade-14">
          <p>No team members yet</p>
        </div>
      )}

      {loading === "failed" && (
        <div className="mt-6 flex justify-center text-sm font-medium text-gray-shade-14">
          <p>Failed to load team members</p>
        </div>
      )}
    </>
  );
};

export default TeamMembersPage;
