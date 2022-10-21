// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current page imports
import { SingleNotification } from "./_components";
import { useNotificationsStore } from "@/store/notifications.store";

const Notifications: NextPageWithLayout = () => {
  const notifications = useNotificationsStore((state) => state.notifications);

  return (
    <div>
      <div className={sectionName}>Notifications</div>
      {/* <NoNotification /> */}
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => {
          return (
            <SingleNotification {...notification} key={notification._id} />
          );
        })}
      </div>
      {/* <SingleNotification /> */}
    </div>
  );
};

Notifications.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Notifications">{page}</AllPagesWrapper>;
};

export default Notifications;

const sectionName = ctl(
  `animationTextHeading mb-8 lg:!text-[34px] sm:!text-2xl`
);
