import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";

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
    <div
      className={`
  flex
  gap-1 
  flex-col
`}
    >
      <span
        className={`
  font-bold
  text-[11px] 
  pl-6
  pr-4
  
  text-gray-shade-11
`}
      >
        {props.section.label}
      </span>
      <div
        className={`
  flex
  gap-[2px] 
  flex-col
`}
      >
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
                "flex justify-between pl-6 pr-4 py-[6px]"
              )}
            >
              <div
                className={`
  flex 
  gap-2 
  items-center
`}
              >
                <item.icon
                  className={
                    router.pathname
                      .replaceAll("-", " ")
                      .includes(item.label.toLowerCase())
                      ? `stroke-white stroke-[1.5]`
                      : `stroke-gray-shade-7 stroke-[1.5]`
                  }
                />
                <Link
                  href={item.url}
                  onClick={props.onClose}
                  className={
                    router.pathname
                      .replaceAll("-", " ")
                      .includes(item.label.toLowerCase())
                      ? `
  text-sm
  font-semibold 
  text-white 
`
                      : `
  text-sm
  font-semibold 
  text-gray-shade-7 
`
                  }
                >
                  {item.label}
                </Link>
              </div>
              {!!count && props.user && (
                <span className="bg-brand-primary rounded-lg w-9 h-5 flex items-center justify-center px-2 py-[2px] text-sm font-semibold text-black-shade-7">
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
