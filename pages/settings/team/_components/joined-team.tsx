import { useRouter } from "next/router";
import Image from "next/image";
import FinalButton from "@/components/button/final.button";
import { User } from "@/models/user";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";

export const JoinedTeam: React.FC<{
  joinedOrgUser: User;
  handleLeaveTeam: () => void;
}> = ({ joinedOrgUser, handleLeaveTeam }) => {
  const router = useRouter();
  const verificationTick = useVerificationTick({
    user: joinedOrgUser,
  });

  return (
    <div className="rounded-10px border border-gray-shade-3 px-6 py-4">
      <div className="flex items-center">
        <h3 className="flex-grow font-semibold text-white">
          You are member of
        </h3>
        <FinalButton
          title="Leave Team"
          variant="secondary"
          className="text-sm"
          borderRounded="12px"
          onClick={handleLeaveTeam}
        />
      </div>

      <div className="mt-4 flex items-center gap-x-2">
        <Image
          src={joinedOrgUser.profile_image}
          alt={joinedOrgUser.display_name}
          width={40}
          height={40}
          className="cursor-pointer rounded-full"
          onClick={() => {
            router.push({
              pathname: AppRoutes.profile.user_id,
              query: { user_id: joinedOrgUser._id },
            });
          }}
        />
        <div>
          <h3
            className="word-break cursor-pointer text-sm font-semibold text-white"
            onClick={() => {
              router.push({
                pathname: AppRoutes.profile.user_id,
                query: { user_id: joinedOrgUser._id },
              });
            }}
          >
            <span>{joinedOrgUser.display_name}</span>
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
          {joinedOrgUser.profile_bio && (
            <h5 className="word-break mt-1 text-xs font-normal text-gray-shade-18">
              {joinedOrgUser.profile_bio}
            </h5>
          )}
        </div>
      </div>
    </div>
  );
};
