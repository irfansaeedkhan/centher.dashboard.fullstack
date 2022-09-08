// React, Next, NPM Packages
import React from "react";
import { NextPage } from "next";

// App Components and Data
import { RightSection } from "@/components/signup.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { SignupLeft } from "@/components/signup.left";
import { AppRoutes } from "@/constants/app.routes";

// Current File's Components and Data
import { RegisterForm } from "@/pages.components/register";

const Register: NextPage = () => {
  return (
    <PageWrapper>
      <SignupLeft
        variant="desktop"
        title={signupLeftData.title}
        content={signupLeftData.content}
      />
      <RightSection>
        <SignupLeft
          variant="mobile"
          title={signupLeftData.title}
          content={signupLeftData.content}
        />
        <AboutMember
          asked="Already a memebr?"
          title="Log in now"
          link={AppRoutes.login}
        />
        <RegisterForm />
      </RightSection>
    </PageWrapper>
  );
};

export default Register;

const signupLeftData = {
  title: "Register to Nether NFT",
  content:
    "Register your account with nether NFT to sell and buy NFTs on some easy steps.",
};
