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
    <div className={componentWrapper}>
      <span className="text-white">{props.asked}</span>
      <span className={linkWrappper}>
        <Link href={props.link}>{props.title}</Link>
      </span>
    </div>
  );
};

const componentWrapper = ctl(`
  flex 
  gap-1
  text-sm 
  font-medium 
  justify-end
  items-center 
`);

const linkWrappper = ctl(`
  dynamicTranss
  cursor-pointer 
  text-brand-primary 
`);
