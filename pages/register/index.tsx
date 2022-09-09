// React, Next, NPM Packages
import React from "react";
import { GetServerSideProps, NextPage } from "next";

// App imports
import { RightSection } from "@/components/signup.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { SignupLeft } from "@/components/signup.left";
import { AppRoutes } from "@/constants/app.routes";
import { AvatarList } from "@/models/avatars";
import { axiosNodeApi } from "@/utils/axios";

// Current page's components imports
import { RegisterForm } from "@/pages.components/register";

interface RegisterProps {
  avatars: AvatarList;
}

const Register: NextPage<RegisterProps> = (props) => {
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
        <RegisterForm avatars={props.avatars} />
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

// Get server side props
export const getServerSideProps: GetServerSideProps<
  RegisterProps
> = async () => {
  const { data } = await axiosNodeApi.get("/api/public/avatars.json");

  return {
    props: {
      avatars: data as AvatarList,
    },
  };
};
