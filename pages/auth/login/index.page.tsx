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
import { LoginForm } from "./_components";
import Image from "next/image";
import Link from "next/link";
import { LogoText } from "@/assets/svgs";

const Login: NextPageWithLayout = () => {
  return <LoginForm />;
};

Login.getLayout = (page) => {
  return (
    <PageWrapper pageTitle="Login">
      <AuthLeft
        variant="desktop"
        title={signupLeftData.title}
        content={signupLeftData.content}
      />
      <AuthRight>
        <div className="w-fit md:hidden flex mb-8">
          <Link href={AppRoutes.home}>
            <Image
              src="/images/nether.nft.logo.svg"
              alt="Nether NFT Logo"
              width={154}
              height={32}
            />
          </Link>
        </div>
        <AboutMember
          asked="Not a member?"
          title="Register now"
          link={AppRoutes.auth.register}
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

export default Login;

const signupLeftData = {
  title: "Connect wallet",
  content:
    "Login to your account with Netheru to sell and buy NFTs on some easy steps.",
};
