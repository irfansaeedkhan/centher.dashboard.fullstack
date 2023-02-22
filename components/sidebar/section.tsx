import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import ctl from "@netlify/classnames-template-literals";

import { useCountsStore } from "@/store/counts.store";
import { LoggedInUser } from "@/models/user";

import { SidebarSection } from "./shared";

export interface SectionProps {
  user: LoggedInUser | undefined;
  section: SidebarSection;
  onClose?: () => void;
}

export const Section: React.FC<SectionProps> = (props) => {
  const router = useRouter();
  const counts = useCountsStore((state) => state.counts);

  return (
    <div className={sectionWrapper}>
      <span className={sectionLabel}>{props.section.label}</span>
      <div className={sectionWrapper2}>
        {props.section.items.map((item) => {
          let count: number = counts[item.countType ?? "none"];

          if (item.countType === "notifications") {
            count = props.user?.has_seen_notifications_page ? 0 : count;
          }

          return (
            <div
              key={item.label}
              className={clsx(
                router.pathname
                  .replaceAll("-", " ")
                  .includes(item.label.toLowerCase()) && "bg-black-shade-7",
                "flex justify-between py-[6px] pl-6 pr-4"
              )}
            >
              <div className={itemWrapper}>
                <item.icon
                  className={clsx(
                    "h-5 w-5",
                    item.label2
                      ? router.pathname
                          .replaceAll("-", " ")
                          .includes(item.label2.toLowerCase())
                        ? itemIconsActive
                        : itemIcons
                      : router.pathname
                          .replaceAll("-", " ")
                          .includes(item.label.toLowerCase())
                      ? itemIconsActive
                      : itemIcons
                  )}
                />
                <Link
                  href={item.url}
                  onClick={props.onClose}
                  className={
                    item.label2
                      ? router.pathname
                          .replaceAll("-", " ")
                          .includes(item.label2.toLowerCase())
                        ? itemLabelActive
                        : itemLabel
                      : router.pathname
                          .replaceAll("-", " ")
                          .includes(item.label.toLowerCase())
                      ? itemLabelActive
                      : itemLabel
                  }
                >
                  {item.label}
                </Link>
              </div>
              {!!count && props.user && (
                <span className="flex h-5 w-9 items-center justify-center rounded-lg bg-brand-primary px-2 py-[2px] text-sm font-semibold text-black-shade-7">
                  {count}
                </span>
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

const sectionLabel = `font-semibold text-[11px] pl-6 pr-4 text-gray-shade-11`;

const itemWrapper = ctl(`
  flex 
  gap-2 
  items-center
`);

const itemLabel = `text-sm font-medium text-gray-shade-7`;

const itemLabelActive = `text-sm font-medium text-white`;

const itemIcons = ctl(`stroke-gray-shade-7 stroke-[1.5]`);

const itemIconsActive = ctl(`stroke-white stroke-[1.5]`);
