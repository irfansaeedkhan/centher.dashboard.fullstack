import Link from "next/link";
import React from "react";

interface AuthNoteProps {
  title: string;
  link?: string;
}

export const AuthNote: React.FC<AuthNoteProps> = (props) => {
  return (
    <div
      className={`
  py-3 
  px-4 
  flex 
  border 
  flex-col 
  gap-[6px] 
  rounded-lg 
  bg-gray-shade-6 
  border-gray-shade-5 
`}
    >
      <div
        className={`
  text-sm 
  text-white
  font-medium 
`}
      >
        Note:
      </div>
      <p
        className={`
  text-[11px] 
  font-medium 
  text-gray-shade-4 
`}
      >
        {props.title}
      </p>
      {props.link === "/forgot-password" && (
        <Link
          href={props.link}
          className={`
  text-xs 
  underline 
  text-white 
  font-medium
  hover:text-brand-primary
`}
        >
          Forgot password
        </Link>
      )}
    </div>
  );
};
