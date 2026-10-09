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
        <div className="mb-10 w-fit sm:flex md:hidden">
          <Link href={AppRoutes.home}>
            <Image
              src="/images/centher.logo.png"
              alt="Centher Logo"
              width={160}
              height={64}
              className="h-auto w-40"
              priority
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
  title: `Register to ${process.env.NEXT_PUBLIC_BRAND_NAME || "Centher"}`,
  content: `Create an account to take advantage of the whole ${
    process.env.NEXT_PUBLIC_BRAND_NAME || "Centher"
  } SocialFi world`,
};
