import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OptionalType } from "@/staking/types";
import { Memb } from "@/pages/staking/create-staking/_components/staking-review-modal";

const TeamMembers: React.FC<{ teamMemberList: OptionalType<Memb[]> }> = ({
  teamMemberList,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {teamMemberList?.map((member, key) => (
        <Link
          href={`https://app.centher.io/profile/${member.address}`}
          key={key}
          target="_blank"
          className="flex items-center gap-3 rounded-[14px] bg-background-shade-3 px-3 py-2"
        >
          <Image
            src={member.userImage}
            alt="Antonio Marseglia"
            width={50}
            height={50}
            className={`h-[50px] w-[50px] rounded-full object-cover`}
          />
          <div className={`space-y-1`}>
            <div className="flex max-w-[215px] items-center text-sm font-semibold text-white">
              <span className="block max-w-full overflow-hidden truncate text-xs">
                {member.userDisplayName}
              </span>
              <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                <Image
                  src={"/images/rainbow-last-frame.png"}
                  alt={"Verified"}
                  width={20}
                  height={20}
                />
              </span>
            </div>
            <span className={`text-xs text-gray-shade-14`}>{member.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TeamMembers;
