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
  flex 
  flex-col 
  gap-[6px] 
  rounded-lg 
  border 
  border-gray-shade-5 
  bg-gray-shade-6 
  py-3 
  px-4 
`}
    >
      <div
        className={`
  text-sm 
  font-medium
  text-white 
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
  font-medium 
  text-white 
  underline
  hover:text-brand-primary
`}
        >
          Forgot password
        </Link>
      )}
    </div>
  );
};
