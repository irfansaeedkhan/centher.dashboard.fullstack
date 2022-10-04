// React, Next, NPM Packages
import { NextPage } from "next";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Accordion from "@/pages.components/profile.setting/accordion";

// Current directory imports

const Setting: NextPage = () => {
  return (
    /* A wrapper for the page. */
    <AllPagesWrapper pageTitle="Settings">
      <div className="AppWrapper flex flex-col gap-10">
        <Accordion />
      </div>
    </AllPagesWrapper>
  );
};

export default Setting;
