// React, Next, NPM Packages
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import EditProfileForm from "@/pages.components/profile.setting/edit.profile.form";

// Current directory imports

const Setting: NextPage = () => {
  return (
    /* A wrapper for the page. */
    <AllPagesWrapper pageTitle="Settings">
      <div className="AppWrapper flex flex-col gap-10">
        <h1 className={title}>Profile Setting</h1>
        <EditProfileForm />
      </div>
    </AllPagesWrapper>
  );
};

export default Setting;

const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
`);
