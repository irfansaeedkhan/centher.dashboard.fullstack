import Link from "next/link";
import React from "react";

interface AboutMemberProps {
  asked: string;
  title: string;
  link: string;
}

export const AboutMember: React.FC<AboutMemberProps> = (props) => {
  return (
    <div
      className={`mb-8 flex items-center justify-end gap-1 text-sm font-medium`}
    >
      <span className={`text-white`}>{props.asked}</span>
      <span className={`textGradient cursor-pointer`}>
        <Link href={props.link}>{props.title}</Link>
      </span>
    </div>
  );
};
