// React, Next, NPM Packages
import React from "react";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { AuthLeft } from "@/components/auth.left";
import { AppRoutes } from "@/constants/app.routes";

// Current page imports
import { RegisterForm } from "./_components";
import Image from "next/image";

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
          <Image
            src="/images/nether.nft.logo.svg"
            alt="logo"
            width={166}
            height={40}
          />
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
