import React from "react";

interface AuthRightProps {
  children: React.ReactNode;
}

export const AuthRight: React.FC<AuthRightProps> = (props) => {
  return (
    <div
      className={`
  md:w-1/2 
  sm:w-full 
  max-h-screen
  xl:px-[113px] 
bg-black-shade-3 
  overflow-y-scroll
  flex 
  justify-center 
  md:py-32 
  sm:py-10 
  sm:px-5 
  lg:px-20
`}
    >
      <div
        className={`
  w-[496px]
  max-w-[496px]
`}
      >
        {props.children}
      </div>
    </div>
  );
};
