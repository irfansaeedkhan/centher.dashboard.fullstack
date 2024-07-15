import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { AuthLeft } from "@/components/auth.left";
import { AppRoutes } from "@/constants/app.routes";
import { RegisterForm } from "./_components";

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
        <div className="mb-8 w-fit sm:flex md:hidden">
          <Link href={AppRoutes.home}>
            <Image
              src="/images/369x.logo.png"
              alt="369x Logo"
              width={154}
              height={32}
            />
          </Link>
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
  title: "Register to 369x",
  content:
    "Create an account to take advantage of the whole 369x SocialFi world",
};
