import ctl from "@netlify/classnames-template-literals";
import Link from "next/link";
import React from "react";

interface NoteLoginProps {
  title: string;
  link: string;
}

export const NoteLogin: React.FC<NoteLoginProps> = (props) => {
  return (
    <div className={baseClass}>
      <div className={note}>Note:</div>
      <p className={noteP}>{props.title}</p>
      <Link href={props.link}>
        <a className={linkClass}>Forgot password</a>
      </Link>
    </div>
  );
};

const baseClass = ctl(`
  py-3 
  px-4 
  flex 
  border 
  flex-col 
  gap-[6px] 
  rounded-lg 
  bg-gray-shade-6 
  border-gray-shade-5 
`);

const note = ctl(`
  text-sm 
  text-white
  font-medium 
`);

const noteP = ctl(`
  text-[11px] 
  font-medium 
  text-gray-shade-4 
`);

const linkClass = ctl(`
  text-xs 
  underline 
  text-white 
  font-medium
  hover:text-brand-primary
`);
