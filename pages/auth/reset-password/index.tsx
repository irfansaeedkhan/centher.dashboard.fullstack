// React, Next, NPM Packages
import React from "react";
import { NextPage } from "next";

// App imports
import { AuthRight } from "@/components/auth.right";
import { PageWrapper } from "@/components/page.wrapper";
import { AuthLeft } from "@/components/auth.left";

// Current page imports
import { ResetForm } from "@/pages.components/reset.password/reset.password.form";

const ResetPassword: NextPage = () => {
  return (
    <PageWrapper pageTitle="Reset Password">
      <AuthLeft
        variant="desktop"
        title={resetPasswordData.title}
        content={resetPasswordData.content}
      />
      <AuthRight>
        <AuthLeft
          variant="mobile"
          title={resetPasswordData.title}
          content={resetPasswordData.content}
        />
        <ResetForm />
      </AuthRight>
    </PageWrapper>
  );
};

export default ResetPassword;

const resetPasswordData = {
  title: "Reset password",
  content:
    "Password should be minimum 8 characters long and Strong passwords include numbers, letters, and punctuation marks.",
};
