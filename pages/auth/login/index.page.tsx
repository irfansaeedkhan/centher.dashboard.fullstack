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
        {page}
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
