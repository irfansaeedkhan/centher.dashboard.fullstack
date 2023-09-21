import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { PendingInvite } from "@/lib/org-team-members";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";
import { OrgTeamConfirmationModal } from "../../_components";

export const SingleSentInvite: React.FC<{
  invite: PendingInvite;
  handleDeleteSentInvite: (invite_id: string) => Promise<void>;
}> = ({ invite, handleDeleteSentInvite }) => {
  const router = useRouter();
  const verificationTick = useVerificationTick({
    user: invite.user,
  });
  const [isCancelInviteModalOpen, setCancelInviteModalOpen] = useState(false);

  return (
    <>
      <div
        key={invite._id}
        className="flex gap-x-2 border-t border-gray-shade-3 px-3 py-4 text-white first:border-none fmd:px-6"
      >
        <Image
          src={invite.user.profile_image}
          alt={invite.user.display_name}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 cursor-pointer rounded-full"
          onClick={() => {
            router.push({
              pathname: AppRoutes.profile.user_id,
              query: { user_id: invite.user._id },
            });
          }}
        />
        <div className="flex-grow">
          <div className="flex items-start gap-x-2">
            <div className="flex-grow">
              <h3
                className="word-break cursor-pointer text-sm font-medium text-white"
                onClick={() => {
                  router.push({
                    pathname: AppRoutes.profile.user_id,
                    query: { user_id: invite.user._id },
                  });
                }}
              >
                <span>{invite.user.display_name}</span>
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
            </div>

            <div className="flex shrink-0 gap-x-3">
              <div className="rounded-md bg-brand-primary/20 px-3 py-1 text-xs font-semibold text-brand-primary">
                Pending
              </div>
              <button
                className="text-sm font-medium text-white"
                onClick={() => setCancelInviteModalOpen(true)}
              >
                Cancel
              </button>
            </div>
          </div>
          <h5 className="word-break mt-1 text-xs font-normal text-gray-shade-18">
            {invite.title}
          </h5>
        </div>
      </div>

      {invite && (
        <OrgTeamConfirmationModal
          isOpen={isCancelInviteModalOpen}
          onClose={() => setCancelInviteModalOpen(false)}
          modalId="cancel-team-member-invitation"
          modalTitle="Cancel Invitation"
          contentHeading="Are you sure you want to cancel the invitation?"
          contentText={
            <p>
              If you cancel the invitation,{" "}
              <span className="text-white">{invite.user.display_name}</span>{" "}
              will not be able to join the team.
            </p>
          }
          onClickConfirm={() => {
            handleDeleteSentInvite(invite._id).then(() => {
              setCancelInviteModalOpen(false);
            });
          }}
          images={[invite.user.profile_image, invite.org.profile_image]}
        />
      )}
    </>
  );
};
