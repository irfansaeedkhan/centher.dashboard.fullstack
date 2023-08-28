import React from "react";
import Image from "next/image";
import Link from "next/link";

const teamMemberList = [
  {
    name: "Antonio Marseglia",
    title: "Chief Metaverse Officer",
    image: "/images/antonio-marseglia.png",
    url: "https://app.centher.io/profile/0x8a437ec0843d57abbff57bf5a77f0cd88f1b0e7a",
  },
  {
    name: "Antonio De Rosa",
    title: "Chief Marketing Officer",
    image: "/images/antonio-de-rosa.png",
    url: "https://app.centher.io/profile/0x12fdc603d1a702b878d3757a348cd8e30abf754c",
  },
  {
    name: "Antonio Monaco",
    title: "Chief Technology Officer",
    image: "/images/antonio-monaco.png",
    url: "https://app.centher.io/profile/0x5e377fcf96c8280891aa84e6b3b4698c2cc5229a",
  },
  {
    name: "Jayant Khanuja",
    title: "Environment and Lands Designer",
    image: "/images/jayant-khanuja.png",
    url: "https://app.centher.io/profile/0x7e8b98369ce4afa606b32652bbf9ca37ab20e294",
  },
];

const TeamMembers: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {teamMemberList?.map((member, key) => (
        <Link
          href={member.url}
          key={key}
          target="_blank"
          className="flex items-center gap-3 rounded-[14px] bg-background-shade-3 px-3 py-2"
        >
          <Image
            src={member.image}
            alt="Antonio Marseglia"
            width={50}
            height={50}
            className={`h-[50px] w-[50px] rounded-full object-cover`}
          />
          <div className={`space-y-1`}>
            <div className="flex max-w-[215px] items-center text-sm font-semibold text-white">
              <span className="block max-w-full overflow-hidden truncate text-xs">
                {member.name}
              </span>
              <span className="verifiedIcon ml-1 inline-flex h-5 w-5 min-w-[1.25rem]">
                <Image
                  src={"/images/verified-icon.svg"}
                  alt={"Verified"}
                  width={16}
                  height={16}
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
