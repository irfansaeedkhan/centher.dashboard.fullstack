// React, Next, NPM Packages
import { NextPage } from "next";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports

const Notifications: NextPage = () => {
  return (
    /* A wrapper for the page. */
    <AllPagesWrapper pageTitle="Notifications">
      <div>
        <div className={sectionName}>Notifications</div>
      </div>
    </AllPagesWrapper>
  );
};

export default Notifications;

const sectionName = ctl(`animationTextHeading`);
