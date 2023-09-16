import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OptionalType } from "@/staking/types";
import { Memb } from "@/pages/staking/create-staking/_components/staking-review-modal";
import { AppRoutes } from "@/constants/app.routes";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

const TeamMembers: React.FC<{ teamMemberList: OptionalType<Memb[]> }> = ({
  teamMemberList,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {teamMemberList?.map((member) => (
        <SingleTeamMember key={member.address} member={member} />
      ))}
    </div>
  );
};

export default TeamMembers;

const SingleTeamMember: React.FC<{ member: Memb }> = ({ member }) => {
  const verificationTick = useVerificationTick({
    user: member,
  });

  return (
    <Link
      href={{
        pathname: AppRoutes.profile.user_id,
        query: { user_id: member.address },
      }}
      target="_blank"
      className="flex items-center gap-3 rounded-[14px] bg-background-shade-3 px-3 py-2"
    >
      <Image
        src={member.userImage}
        alt={member.userDisplayName}
        width={50}
        height={50}
        className={`h-[50px] w-[50px] rounded-full object-cover`}
      />
      <div className={`space-y-1`}>
        <div className="flex max-w-[215px] items-center text-sm font-semibold text-white">
          <span className="block max-w-full overflow-hidden truncate text-xs">
            {member.userDisplayName}
          </span>
          {verificationTick && (
            <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
              <Image
                src={verificationTick}
                alt={"Membership"}
                width={20}
                height={20}
              />
            </span>
          )}
        </div>
        <span className={`text-xs text-gray-shade-14`}>{member.title}</span>
      </div>
    </Link>
  );
};
