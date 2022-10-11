// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { SingleNotification } from "@/pages.components/notifications";

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
