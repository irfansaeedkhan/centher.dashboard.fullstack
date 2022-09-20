import { NextPage } from "next";
import React from "react";

import { AuthLeft } from "@/components/auth.left";
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";

import { RegisterationFees } from "@/pages.components/registration.fess";

const PayRegistrationFee: NextPage = () => {
  return (
    <PageWrapper>
      <AuthLeft variant="desktop" title={data.title} content={data.content} />
      <AuthRight>
        <AuthLeft variant="mobile" title={data.title} content={data.content} />
        <RegisterationFees />
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
