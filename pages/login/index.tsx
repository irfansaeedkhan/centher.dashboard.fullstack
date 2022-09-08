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
import { LoginForm } from "@/pages.components/login";

const Login: NextPage = () => {
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
          asked="Not a member?"
          title="Register now"
          link={AppRoutes.register}
        />
        <LoginForm />
      </RightSection>
    </PageWrapper>
  );
};

export default Login;

const signupLeftData = {
  title: "Login to Netheru",
  content:
    "Login to your account with netheru to sell and buy NFTs on some easy steps.",
};
