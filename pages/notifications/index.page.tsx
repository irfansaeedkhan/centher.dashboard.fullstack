import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ctl from "@netlify/classnames-template-literals";

import { useNotificationsStore } from "@/store/notifications.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import SingleNotificationSkeleton from "@/components/loading.skeletons/single.notification";

import {
  SingleNotification,
  useMarkNotificationsPageAsSeen,
} from "./_components";

const Notifications: NextPageWithLayout = () => {
  // Mark notifications page as seen
  useMarkNotificationsPageAsSeen();

  const { notifications, fetchNotifications, offset, updateOffset } =
    useNotificationsStore((state) => ({
      notifications: state.notifications,
      fetchNotifications: state.fetchNotifications,
      offset: state.offset,
      updateOffset: state.updateOffset,
    }));

  const [lastNotiRef, lastNotiInView] = useInView();

  useEffect(() => {
    if (lastNotiInView) {
      updateOffset();
    }
  }, [lastNotiInView, updateOffset]);

  useEffect(() => {
    fetchNotifications(offset);
  }, [fetchNotifications, offset]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className={sectionName}>Notifications</div>
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => {
          if (
            notification._id === notifications[notifications.length - 1]._id
          ) {
            return (
              <SingleNotification
                ref={lastNotiRef}
                notification={notification}
                key={notification._id}
              />
            );
          }
          return (
            <SingleNotification
              notification={notification}
              key={notification._id}
            />
          );
        })}
      </div>
      {notifications.length === 0 && <SingleNotificationSkeleton />}
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
