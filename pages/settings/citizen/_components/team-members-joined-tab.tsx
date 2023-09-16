import React from "react";
import toast from "react-hot-toast";
import { removeOrgMembers } from "@/lib/org-team-members";
import { useGetOrgMembers } from "@/hooks/org-team-members";
import { LoggedInUser } from "@/models/user";
import { SingleOrgMember } from "./single-org-member";

interface Props {
  loggedInUser: LoggedInUser;
}

export const TeamMembersJoinedTab: React.FC<Props> = ({ loggedInUser }) => {
  const { orgMembers, removeOrgMember, loading } = useGetOrgMembers(
    loggedInUser?._id
  );

  const handleRemoveOrgMember = async (user_id: string) => {
    try {
      await removeOrgMembers(user_id);
      removeOrgMember(user_id);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {loading === "loaded" && !!orgMembers.length && (
        <section className="w-full rounded-10px border border-gray-shade-3">
          {orgMembers.map((member) => (
            <SingleOrgMember
              key={member.user_id}
              member={member}
              handleRemoveOrgMember={handleRemoveOrgMember}
            />
          ))}
        </section>
      )}

      {loading === "loaded" && !orgMembers.length && (
        <div className="rounded-10px border border-gray-shade-3 px-6 py-4">
          <p className="text-center text-sm font-normal text-gray-shade-18">
            Invite your team members to join your organization
          </p>
        </div>
      )}
    </>
  );
};
