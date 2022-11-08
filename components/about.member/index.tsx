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
      className={`
  flex 
  gap-1
  text-sm 
  font-medium 
  justify-end
  items-center
  mb-8 
`}
    >
      <span className={`text-white`}>{props.asked}</span>
      <span
        className={`
  cursor-pointer 
  text-brand-primary 
`}
      >
        <Link href={props.link}>{props.title}</Link>
      </span>
    </div>
  );
};
