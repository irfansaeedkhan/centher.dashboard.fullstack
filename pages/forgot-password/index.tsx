// React, Next, NPM Packages
import React from "react";
import { NextPage } from "next";

// App imports
import { RightSection } from "@/components/signup.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AuthLeft } from "@/components/auth.left";

// Current directory imports
import { ForgotForm } from "@/pages.components/forgot.password/forgot.form";

const ForgotPassword: NextPage = () => {
  return (
    <PageWrapper>
      <AuthLeft
        variant="desktop"
        title={forgotPasswordData.title}
        content={forgotPasswordData.content}
      />
      <RightSection>
        <AuthLeft
          variant="mobile"
          title={forgotPasswordData.title}
          content={forgotPasswordData.content}
        />
        <ForgotForm />
      </RightSection>
    </PageWrapper>
  );
};

export default ForgotPassword;

const forgotPasswordData = {
  title: "Forgot password",
  content:
    "Enter the email address or public key you used when you joined and we'll send you instructions to reset your password.",
};
