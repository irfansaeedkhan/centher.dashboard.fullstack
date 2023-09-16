import { useRouter } from "next/router";
import Image from "next/image";
import { OrgMember } from "@/lib/org-team-members";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";

export const SingleOrgMember: React.FC<{
  member: OrgMember;
  handleRemoveOrgMember: (user_id: string) => void;
}> = ({ member, handleRemoveOrgMember }) => {
  const router = useRouter();
  const verificationTick = useVerificationTick({
    user: member,
  });

  return (
    <div
      key={member.user_id}
      className="flex border-t border-gray-shade-3 px-6 py-4 text-white first:border-none"
    >
      <div className="flex flex-grow items-center gap-x-2">
        <Image
          src={member.profile_image}
          alt={member.display_name}
          width={40}
          height={40}
          className="cursor-pointer rounded-full"
          onClick={() => {
            router.push({
              pathname: AppRoutes.profile.user_id,
              query: { user_id: member.user_id },
            });
          }}
        />
        <div>
          <h3
            className="cursor-pointer text-sm font-semibold text-white"
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
          <h5 className="mt-1 text-xs font-normal text-gray-shade-18">
            {member.title}
          </h5>
        </div>
      </div>

      <button
        className="text-sm font-medium text-white"
        onClick={() => handleRemoveOrgMember(member.user_id)}
      >
        Remove
      </button>
    </div>
  );
};
