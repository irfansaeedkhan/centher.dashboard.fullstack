// React, Next, NPM Packages
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { useNotificationsStore } from "@/store/notifications.store";
import { LoggedInUser } from "@/models/user";

// Current directory imports
import { SidebarSection } from "./shared";

export interface SectionProps {
  user: LoggedInUser | undefined;
  section: SidebarSection;
  onClose?: () => void;
}

export const Section: React.FC<SectionProps> = (props) => {
  const router = useRouter();
  const { notifications, fetchNotifications } = useNotificationsStore(
    (state) => ({
      notifications: state.notifications,
      fetchNotifications: state.fetchNotifications,
    })
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className={sectionWrapper}>
      <span className={sectionLabel}>{props.section.label}</span>
      <div className={sectionWrapper2}>
        {props.section.items.map((item) => {
          let count: number | string = 0;

          if (item.countType === "notification") {
            count = notifications.filter((n) => n.status === "unread").length;
            count = count > 9 ? "9+" : count;
          } else if (item.countType === "chat") {
            count = 0;
          }

          count = props.user?.has_seen_notifications_page ? "" : count;

          return (
            <div
              key={item.label}
              className={clsx(
                router.pathname
                  .replaceAll("-", " ")
                  .includes(item.label.toLowerCase()) && "bg-black-shade-7",
                "flex justify-between pl-6 pr-4 py-[6px]"
              )}
            >
              <div className={itemWrapper}>
                <item.icon
                  className={
                    router.pathname
                      .replaceAll("-", " ")
                      .includes(item.label.toLowerCase())
                      ? itemIconsActive
                      : itemIcons
                  }
                />
                <Link
                  href={item.url}
                  onClick={props.onClose}
                  className={
                    router.pathname
                      .replaceAll("-", " ")
                      .includes(item.label.toLowerCase())
                      ? itemLabelActive
                      : itemLabel
                  }
                >
                  {item.label}
                </Link>
              </div>
              {!!count && (
                // <div>
                <span className="bg-brand-primary rounded-lg w-9 h-5 flex items-center justify-center px-2 py-[2px] text-sm font-semibold text-black-shade-7">
                  {count}
                </span>
                // </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const sectionWrapper = ctl(`
  flex
  gap-1 
  flex-col
`);
const sectionWrapper2 = ctl(`
  flex
  gap-[2px] 
  flex-col
`);

const sectionLabel = ctl(`
  font-bold
  text-[11px] 
  pl-6
  pr-4
  
  text-gray-shade-11
`);

const itemWrapper = ctl(`
  flex 
  gap-2 
  items-center
`);

const itemLabel = ctl(`
  text-sm
  font-semibold 
  text-gray-shade-7 
`);

const itemLabelActive = ctl(`
  text-sm
  font-semibold 
  text-white 
`);

const itemIcons = ctl(`stroke-gray-shade-7 stroke-[1.5]`);

const itemIconsActive = ctl(`stroke-white stroke-[1.5]`);
