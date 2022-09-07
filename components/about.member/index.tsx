import ctl from "@netlify/classnames-template-literals";
import Link from "next/link";
import React from "react";

interface AboutMemberProps {
  asked: string;
  title: string;
  link: string;
}

export const AboutMember: React.FC<AboutMemberProps> = (props) => {
  return (
    <div className={baseClass}>
      <span className="text-white">{props.asked}</span>
      <span className={baseClass2}>
        <Link href={`/${props.link}`}>{props.title}</Link>
      </span>
    </div>
  );
};

const baseClass = ctl(`
  flex 
  gap-1
  text-sm 
  font-medium 
  justify-end
  items-center 
`);

const baseClass2 = ctl(`
  dynamicTranss
  cursor-pointer 
  text-brand-primary 
`);
