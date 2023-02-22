import React from "react";

interface AuthRightProps {
  children: React.ReactNode;
}

export const AuthRight: React.FC<AuthRightProps> = (props) => {
  return (
    <div
      className={`flex max-h-screen w-full justify-center overflow-y-scroll bg-black-shade-3 py-10 px-5 md:w-1/2 md:py-32 lg:px-20 f2xl:px-[113px]`}
    >
      <div className={`w-[496px] max-w-[496px]`}>{props.children}</div>
    </div>
  );
};
