import React from "react";
import toast from "react-hot-toast";
import { deleteSentInvite } from "@/lib/org-team-members";
import { useGetSentInvites } from "@/hooks/org-team-members";
import { SingleSentInvite } from "./single-sent-invite";

export const TeamMembersInvitationsTab: React.FC = () => {
  const { sentInvites, removeSentInvite, loading } = useGetSentInvites();

  const handleDeleteSentInvite = async (invite_id: string) => {
    try {
      await deleteSentInvite(invite_id);
      removeSentInvite(invite_id);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {loading === "loaded" && !!sentInvites.length && (
        <section className="w-full rounded-10px border border-gray-shade-3">
          {sentInvites.map((invite) => (
            <SingleSentInvite
              key={invite._id}
              invite={invite}
              handleDeleteSentInvite={handleDeleteSentInvite}
            />
          ))}
        </section>
      )}

      {loading === "loaded" && !sentInvites.length && (
        <div className="rounded-10px border border-gray-shade-3 px-6 py-4">
          <p className="text-center text-sm font-normal text-gray-shade-18">
            Invite your team members to join your organization
          </p>
        </div>
      )}
    </>
  );
};
