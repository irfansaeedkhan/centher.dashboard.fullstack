import { AuthLeft } from "@/components/auth.left";
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";
import { RegisterationFees } from "@/pages.components/registration.fess";
import { NextPage } from "next";
import React from "react";

const PayRegistrationFee: NextPage = () => {
  return (
    <PageWrapper>
      <AuthLeft variant="desktop" title={Data.title} content={Data.content} />
      <AuthRight>
        <AuthLeft variant="mobile" title={Data.title} content={Data.content} />
        <RegisterationFees />
      </AuthRight>
    </PageWrapper>
  );
};

export default PayRegistrationFee;

const Data = {
  title: "Pay Registeration fee",
  content:
    "You need to pay Registration fee for getting in to Nether NFT platform. Pay fee and start your business.",
};
