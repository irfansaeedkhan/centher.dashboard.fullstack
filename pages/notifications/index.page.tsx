// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current page imports
import { SingleNotification } from "./_components";

const Notifications: NextPageWithLayout = () => {
  return (
    <div>
      <div className={sectionName}>Notifications</div>
      {/* <NoNotification /> */}
      <SingleNotification />
    </div>
  );
};

Notifications.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Notifications">{page}</AllPagesWrapper>;
};

export default Notifications;

const sectionName = ctl(`animationTextHeading`);
