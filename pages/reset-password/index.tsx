// React, Next, NPM Packages
import React from "react";
import { NextPage } from "next";

// App imports
import { RightSection } from "@/components/signup.right";
import { PageWrapper } from "@/components/page.wrapper";
import { SignupLeft } from "@/components/signup.left";

// Current directory imports
import { ResetForm } from "@/pages.components/reset.password/reset.password.form";

const ResetPassword: NextPage = () => {
  return (
    <PageWrapper>
      <SignupLeft
        variant="desktop"
        title={resetPasswordData.title}
        content={resetPasswordData.content}
      />
      <RightSection>
        <SignupLeft
          variant="mobile"
          title={resetPasswordData.title}
          content={resetPasswordData.content}
        />
        <ResetForm />
      </RightSection>
    </PageWrapper>
  );
};

export default ResetPassword;

const resetPasswordData = {
  title: "Reset password",
  content:
    "Password should be minimum 6 characters long and Strong passwords include numbers, letters, and punctuation marks.",
};
