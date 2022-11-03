// React, Next, NPM Packages
import React from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";
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
        className={`w-1/2 py-11 px-12 gap-10 md:flex flex-col sm:hidden bg-background-shade-1 `}
      >
        <div className={`w-fit`}>
          <Link href={AppRoutes.home}>
            <Image
              src="/images/nether.nft.logo.svg"
              alt="Nether NFT Logo"
              width={154}
              height={32}
            />
          </Link>
        </div>
        <div
          className={`flex gap-16 xl:px-32 lg:px-20 md:px-10 flex-col items-center`}
        >
          <div className={`w-fit`}>
            <Image
              src="/images/nether.nft.favicon.svg"
              alt="logo"
              width={310}
              height={310}
            />
          </div>
          <div className={section_left_text_wrapper}>
            <h1 className={title}>{props.title}</h1>
            <p className={content}>{props.content}</p>
          </div>
        </div>
      </section>
    );
  }

  if (props.variant === "mobile") {
    return (
      <section className={section_right_mobile_content_wrapper}>
        <div className={section_right_mobile_text_wrapper}>
          <h1 className={titleMobile}>{props.title}</h1>
          <p className={contentMobile}>{props.content}</p>
        </div>
      </section>
    );
  }
  return null;
};

const section_left = ctl(`
 
`);

const section_right_mobile_text_wrapper = ctl(`
  flex 
  gap-4
  flex-col 
`);

const section_right_mobile_content_wrapper = ctl(`
  mb-5 
  gap-10 
  sm:flex 
  flex-col 
  md:hidden 
`);

const section_left_content_wrapper =
  ctl(`flex gap-16 xl:px-32 lg:px-20 md:px-10 flex-col items-center 
`);

const section_left_text_wrapper = ctl(`
  flex 
  gap-6 
  flex-col 
  items-center
`);

const title = ctl(`
  text-2xl 
  text-white
  text-center
  font-semibold 
`);
const titleMobile = ctl(`
  text-2xl 
  text-white
  font-semibold 
`);

const content = ctl(`
  text-sm 
  text-center
  font-medium 
  text-gray-shade-4 
`);

const contentMobile = ctl(`
  text-sm 
  font-medium 
  text-gray-shade-4 
`);

const sectionLeftInner = ctl(``);
