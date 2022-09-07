import React from "react";
import { LoginForm, SignupLeft } from "@/pages.components/login";
import { RightSection } from "@/components/signup.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";

const Login: React.FC<any> = () => {
  return (
    <PageWrapper>
      <SignupLeft
        varient="desktop"
        title="Login to Netheru"
        content="Login to your account with netheru to sell and buy NFTs on some easy steps."
      />
      <RightSection>
        <SignupLeft
          varient="mobile"
          title="Login to Netheru"
          content="Login to your account with netheru to sell and buy NFTs on some easy steps."
        />
        <AboutMember
          asked="Not a member?"
          title="Register now"
          link="register"
        />
        <LoginForm />
      </RightSection>
    </PageWrapper>
  );
};

export default Login;
