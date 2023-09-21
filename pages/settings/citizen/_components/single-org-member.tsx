import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { OrgMember } from "@/lib/org-team-members";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";
import { OrgTeamConfirmationModal } from "../../_components";

export const SingleOrgMember: React.FC<{
  member: OrgMember;
  handleRemoveOrgMember: (user_id: string) => Promise<void>;
}> = ({ member, handleRemoveOrgMember }) => {
  const router = useRouter();
  const verificationTick = useVerificationTick({
    user: member,
  });
  const [isRemoveMemberModalOpen, setRemoveMemberModalOpen] = useState(false);

  return (
    <>
      <div
        key={member.user_id}
        className="flex gap-x-2 border-t border-gray-shade-3 px-3 py-4 text-white first:border-none fmd:px-6"
      >
        <Image
          src={member.profile_image}
          alt={member.display_name}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 cursor-pointer rounded-full"
          onClick={() => {
            router.push({
              pathname: AppRoutes.profile.user_id,
              query: { user_id: member.user_id },
            });
          }}
        />

        <div className="flex-grow">
          <div className="flex items-start gap-x-2">
            <h3
              className="word-break flex-grow cursor-pointer text-sm font-semibold text-white"
              onClick={() => {
                router.push({
                  pathname: AppRoutes.profile.user_id,
                  query: { user_id: member.user_id },
                });
              }}
            >
              <span>{member.display_name}</span>
              {verificationTick && (
                <Image
                  src={verificationTick}
                  alt={"Membership"}
                  width={16}
                  height={16}
                  className="-mt-0.5 ml-0.5 inline-block"
                />
              )}
            </h3>
            <button
              className="shrink-0 text-sm font-medium text-white"
              onClick={() => setRemoveMemberModalOpen(true)}
            >
              Remove
            </button>
          </div>
          <h5 className="word-break mt-1 text-xs font-normal text-gray-shade-18">
            {member.title}
          </h5>
        </div>
      </div>

      {member && (
        <OrgTeamConfirmationModal
          isOpen={isRemoveMemberModalOpen}
          onClose={() => setRemoveMemberModalOpen(false)}
          modalId="remove-team-member"
          modalTitle="Remove Team Member"
          contentHeading="Are you sure you want to remove the team member?"
          contentText={
            <p>
              <span className="text-white">{member.display_name}</span> will be
              removed from team and will no longer be visible in the Team tab on
              your profile.
            </p>
          }
          onClickConfirm={() => {
            handleRemoveOrgMember(member.user_id).then(() => {
              setRemoveMemberModalOpen(false);
            });
          }}
          images={[member.profile_image]}
        />
      )}
    </>
  );
};
