import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { PendingInvite } from "@/lib/org-team-members";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";

export const SingleReceivedInvite: React.FC<{
  invite: PendingInvite;
  handleAcceptInvite: (inviteId: string) => void;
  handleRejectInvite: (inviteId: string) => void;
}> = ({ invite, handleAcceptInvite, handleRejectInvite }) => {
  const verificationTick = useVerificationTick({
    user: invite.org,
  });

  return (
    <div
      className="flex border-t border-gray-shade-3 px-6 py-4 first:border-none"
      key={invite._id}
    >
      <div className="flex flex-grow gap-x-3">
        <div className="shrink-0">
          <Image
            src={invite.user.profile_image}
            alt={invite.user.display_name}
            width={40}
            height={40}
            className="inline-block rounded-full"
          />
          <Image
            src={invite.org.profile_image}
            alt={invite.org.display_name}
            width={40}
            height={40}
            className="-ml-[20px] inline-block rounded-full"
          />
        </div>
        <div>
          <p className="text-sm text-white">
            You are invited to join{" "}
            <Link
              href={{
                pathname: AppRoutes.profile.user_id,
                query: { user_id: invite.org._id },
              }}
              className="textGradient font-medium"
            >
              <span>{invite.org.display_name}</span>
              {verificationTick && (
                <Image
                  src={verificationTick}
                  alt={"Membership"}
                  width={16}
                  height={16}
                  className="-mt-0.5 ml-0.5 inline-block"
                />
              )}
            </Link>
          </p>

          <div className="mt-2">
            <button
              className="rounded-md bg-brand-primary/20 px-3 py-1 text-xs font-medium text-brand-primary"
              onClick={() => handleAcceptInvite(invite._id)}
            >
              Accept
            </button>
            <button
              className="rounded-md px-3 py-1 text-xs font-medium text-red-theme"
              onClick={() => handleRejectInvite(invite._id)}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-shade-14">
        {dayjs(invite.invited_at).format("DD MMM, YYYY")}
      </div>
    </div>
  );
};
