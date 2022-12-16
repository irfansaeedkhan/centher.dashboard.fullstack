// React, Next, NPM Packages
import React from "react";
import Image from "next/image";
import Link from "next/link";

// App imports
import { AppRoutes } from "@/constants/app.routes";
import { LogoText } from "@/assets/svgs";

interface SignupProps {
  title: string;
  content: string;
  variant: "desktop" | "mobile";
}

export const AuthLeft: React.FC<SignupProps> = (props) => {
  if (props.variant === "desktop") {
    return (
      <section
        className={`w-1/2 py-11 px-12 gap-10 md:flex flex-col hidden bg-background-shade-1 `}
      >
        <div className={`w-fit`}>
          <Link href={AppRoutes.home}>
            <Image
              src="/images/nether.nft.logo.svg"
              alt="CENTHER NFT Logo"
              width={154}
              height={32}
            />
          </Link>
        </div>
        <div
          className={`flex gap-16 f2xl:px-32 lg:px-20 md:px-10 flex-col items-center`}
        >
          <div className={`w-fit`}>
            <Image
              src="/images/nether.nft.favicon.svg"
              alt="logo"
              width={310}
              height={310}
            />
          </div>
          <div className={`flex gap-6 flex-col items-center`}>
            <h1 className={`text-2xl text-white text-center font-semibold`}>
              {props.title}
            </h1>
            <p className={`text-sm text-center font-medium text-gray-shade-4`}>
              {props.content}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (props.variant === "mobile") {
    return (
      <section className={`mb-5 gap-10 flex flex-col md:hidden`}>
        <div className={`flex gap-4 flex-col`}>
          <h1 className={`text-2xl text-white font-semibold`}>{props.title}</h1>
          <p className={`text-sm font-medium text-gray-shade-4`}>
            {props.content}
          </p>
        </div>
      </section>
    );
  }
  return null;
};
