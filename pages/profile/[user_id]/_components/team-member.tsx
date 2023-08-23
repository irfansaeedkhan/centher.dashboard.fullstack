import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { OrgMember } from "@/lib/org-team-members";
import { AppRoutes } from "@/constants/app.routes";
import cn from "@/utils/cn";

interface Props {
  member: OrgMember;
  className?: string;
}

const TeamMember: React.FC<Props> = ({ member, className }) => {
  const verificationTick = useVerificationTick({
    user: member,
  });

  return (
    <Link
      href={{
        pathname: AppRoutes.profile.user_id,
        query: { user_id: member.user_id },
      }}
      className={cn(
        "flex items-center gap-3 rounded-[14px] bg-background-shade-3 px-3 py-2",
        className
      )}
    >
      <Image
        src={member.profile_image}
        alt={member.display_name}
        width={50}
        height={50}
        className={`h-[50px] w-[50px] rounded-full object-cover`}
      />
      <div className={`space-y-1`}>
        <div className="flex max-w-[215px] items-center text-sm font-semibold text-white fsm:max-w-[280px]">
          <span className="block max-w-full overflow-hidden truncate text-xs">
            {member.display_name}
          </span>
          {verificationTick && (
            <span className="verifiedIcon ml-1 inline-flex h-5 w-5 min-w-[1.25rem]">
              <Image
                src={verificationTick}
                alt={"Membership"}
                width={16}
                height={16}
              />
            </span>
          )}
        </div>
        <span className={`text-xs text-gray-shade-14`}>{member.title}</span>
      </div>
    </Link>
  );
};

export default TeamMember;
