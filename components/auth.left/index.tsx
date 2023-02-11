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
        className={`hidden w-1/2 flex-col gap-10 bg-background-shade-1 py-11 px-12 md:flex `}
      >
        <div className={`w-fit`}>
          <Link href={AppRoutes.home}>
            <Image
              src="/images/centher.logo.png"
              alt="Centher Logo"
              width={154}
              height={32}
            />
          </Link>
        </div>
        <div
          className={`flex flex-col items-center gap-16 md:px-10 lg:px-20 f2xl:px-32`}
        >
          <div className={`w-fit`}>
            <Image
              src="/images/centher.logo.favicon.png"
              alt="logo"
              width={310}
              height={310}
            />
          </div>
          <div className={`flex flex-col items-center gap-6`}>
            <h1 className={`text-center text-2xl font-semibold text-white`}>
              {props.title}
            </h1>
            <p className={`text-center text-sm font-medium text-gray-shade-4`}>
              {props.content}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (props.variant === "mobile") {
    return (
      <section className={`mb-5 flex flex-col gap-10 md:hidden`}>
        <div className={`flex flex-col gap-4`}>
          <h1 className={`text-2xl font-semibold text-white`}>{props.title}</h1>
          <p className={`text-sm font-medium text-gray-shade-4`}>
            {props.content}
          </p>
        </div>
      </section>
    );
  }
  return null;
};
