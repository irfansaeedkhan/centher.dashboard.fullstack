// React, Next, NPM Packages
import { useRouter } from "next/router";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { useNotificationsStore } from "@/store/notifications.store";

// Current directory imports
import { SidebarSection } from "./shared";

export interface SectionProps {
  section: SidebarSection;
  onClose?: () => void;
}

export const Section: React.FC<SectionProps> = (props) => {
  const router = useRouter();
  const notifications = useNotificationsStore((state) => state.notifications);

  return (
    <div className={sectionWrapper}>
      <span className={sectionLabel}>{props.section.label}</span>
      <div className={sectionWrapper}>
        {props.section.items.map((item) => {
          let count = 0;

          if (item.countType === "notification") {
            count = notifications.filter((n) => n.status === "unread").length;
          } else if (item.countType === "chat") {
            count = 0;
          }

          return (
            <div className={itemWrapper} key={item.label}>
              <item.icon
                className={
                  router.pathname
                    .replaceAll("-", " ")
                    .includes(item.label.toLowerCase())
                    ? itemIconsActive
                    : itemIcons
                }
              />
              <Link href={item.url}>
                <a
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
                </a>
              </Link>

              {!!count && <span className="text-brand-primary">{count}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const sectionWrapper = ctl(`
  flex
  gap-6 
  flex-col
`);

const sectionLabel = ctl(`
  font-bold
  text-[11px] 
  text-gray-shade-7 
`);

const itemWrapper = ctl(`
  flex 
  gap-2 
  items-center
`);

const itemLabel = ctl(`
  text-sm
  font-semibold 
  text-gray-shade-8 
`);

const itemLabelActive = ctl(`
  text-sm
  font-semibold 
  text-white 
`);

const itemIcons = ctl(`stroke-gray-shade-8`);

const itemIconsActive = ctl(`stroke-white`);
