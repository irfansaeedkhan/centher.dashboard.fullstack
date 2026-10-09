import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { AuthLeft } from "@/components/auth.left";
import { AppRoutes } from "@/constants/app.routes";
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
        <div className="mb-10 flex w-fit md:hidden">
          <Link href={AppRoutes.home}>
            <Image
              src="/images/centher.logo.png"
              alt="Centher Logo"
              width={75}
              height={39}
              className="w-18"
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
  content: `Log into your account to take advantage of the whole ${process.env.NEXT_PUBLIC_BRAND_NAME} SocialFi world`,
};
