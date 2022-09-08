import React from "react";
import { LoginForm } from "@/pages.components/login";
import { RightSection } from "@/components/signup.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { SignupLeft } from "@/components/signup.left";
import { RegisterForm } from "@/pages.components/register";

const Register: React.FC<any> = () => {
  return (
    <PageWrapper>
      <SignupLeft
        varient="desktop"
        title="Register to Nether NFT"
        content="Register your account with nether NFT to sell and buy NFTs on some easy steps."
      />
      <RightSection>
        <SignupLeft
          varient="mobile"
          title="Register to Nether NFT"
          content="Register your account with nether NFT to sell and buy NFTs on some easy steps."
        />
        <AboutMember
          asked="Already a memebr?"
          title="Log in now"
          link="login"
        />
        <RegisterForm />
      </RightSection>
    </PageWrapper>
  );
};

export default Register;
