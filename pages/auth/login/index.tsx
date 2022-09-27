// React, Next, NPM Packages
import React from "react";
import { NextPage } from "next";

// App imports
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { AuthLeft } from "@/components/auth.left";
import { AppRoutes } from "@/constants/app.routes";

// Current page imports
import { LoginForm } from "@/pages.components/login";

const Login: NextPage = () => {
  return (
    <PageWrapper pageTitle="Login">
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
          asked="Not a member?"
          title="Register now"
          link={AppRoutes.auth.register}
        />
        <LoginForm />
      </AuthRight>
    </PageWrapper>
  );
};

export default Login;

const signupLeftData = {
  title: "Login to Netheru",
  content:
    "Login to your account with netheru to sell and buy NFTs on some easy steps.",
};
