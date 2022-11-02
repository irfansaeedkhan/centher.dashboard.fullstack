// React, Next, NPM Packages
import React from "react";
import Link from "next/link";
import Image from "next/image";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { AuthLeft } from "@/components/auth.left";
import { AppRoutes } from "@/constants/app.routes";
import { LogoText } from "@/assets/svgs";

// Current page imports
import { RegisterForm } from "./_components";

const Register: NextPageWithLayout = () => {
  return <RegisterForm />;
};

Register.getLayout = (page) => {
  return (
    <PageWrapper pageTitle="Register">
      <AuthLeft
        variant="desktop"
        title={signupLeftData.title}
        content={signupLeftData.content}
      />
      <AuthRight>
        <div className="w-fit md:hidden sm:flex mb-8">
          <Link
            href={AppRoutes.home}
            className="flex items-center gap-4 md:min-w-[166px] sm:min-w-[22px]"
          >
            <Image
              src="/images/nether.nft.favicon.svg"
              alt="Nether NFT Logo"
              width={166}
              height={38}
              className="!w-[22px] !h-[38px]"
            />
            <LogoText />
          </Link>
        </div>
        <AboutMember
          asked="Already a member?"
          title="Log in now"
          link={AppRoutes.auth.login}
        />
        <AuthLeft
          variant="mobile"
          title={signupLeftData.title}
          content={signupLeftData.content}
        />

        {page}
      </AuthRight>
    </PageWrapper>
  );
};

export default Register;

const signupLeftData = {
  title: "Register to Nether NFT",
  content:
    "Register your account with nether NFT to sell and buy NFTs on some easy steps.",
};
