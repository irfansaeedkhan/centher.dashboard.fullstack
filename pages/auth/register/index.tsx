// React, Next, NPM Packages
import React from "react";

// App imports
import { NextPageWithLayout } from "@/pages/_app";
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { AuthLeft } from "@/components/auth.left";
import { AppRoutes } from "@/constants/app.routes";

// Current page imports
import { RegisterForm } from "@/pages.components/register";

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
        <AuthLeft
          variant="mobile"
          title={signupLeftData.title}
          content={signupLeftData.content}
        />
        <AboutMember
          asked="Already a member?"
          title="Log in now"
          link={AppRoutes.auth.login}
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
