// React, Next, NPM Packages
import { NextPage } from "next";
import React from "react";

// App imports
import { AuthLeft } from "@/components/auth.left";
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AboutMember } from "@/components/about.member";
import { AppRoutes } from "@/constants/app.routes";

// Current page imports
import { RegisterationFee } from "@/pages.components/pay.registration.fee";

const PayRegistrationFee: NextPage = () => {
  return (
    <PageWrapper>
      <AuthLeft variant="desktop" title={data.title} content={data.content} />
      <AuthRight>
        <AuthLeft variant="mobile" title={data.title} content={data.content} />
        <AboutMember
          asked="I will pay later."
          title="Go Home"
          link={AppRoutes.home}
        />
        <RegisterationFee />
      </AuthRight>
    </PageWrapper>
  );
};

export default PayRegistrationFee;

const data = {
  title: "Pay Registeration fee",
  content:
    "You need to pay Registration fee for getting in to Nether NFT platform. Pay fee and start your business.",
};
