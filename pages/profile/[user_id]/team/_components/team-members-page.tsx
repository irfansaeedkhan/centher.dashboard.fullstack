import React from "react";
import { useRouter } from "next/router";
import { useGetOrgMembers } from "@/hooks/org-team-members";
import TeamMember from "./team-member";

const TeamMembersPage = () => {
  const router = useRouter();
  const { loading, orgMembers } = useGetOrgMembers(
    router.query.user_id?.toString()
  );

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
