import { SearchIcon } from "@/assets/svgs";
import clsx from "clsx";

import { ContactCard } from "./contact.card";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const MessagesCard: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(`relative max-w-[272px] select-none`, className)}
      {...props}
    >
      <div className="absolute z-50 flex h-full flex-col items-center justify-center">
        <h2 className="animationTextHeading !text-base">Coming Soon</h2>
        <p className="text-center text-xs font-medium text-white">
          Calm Down! We are bringing new expereince for you
        </p>
      </div>
      <div className={`relative rounded-10px bg-background-shade-3 blur-sm`}>
        <div className={`p-4`}>
          <h5 className={`text-14px pb-4 font-semibold text-white`}>
            Messages
          </h5>
          <div
            className={`relative mb-4 h-[38px] w-full overflow-hidden rounded-10px border-2 border-gray-shade-3 bg-background-shade-2  px-3 py-4`}
          >
            <div
              className={`absolute top-[50%] left-[14px] translate-y-[-50%]`}
            >
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name"
              className={`text-12px absolute top-0 left-0 h-full border-0 bg-transparent pl-10 font-light text-gray-shade-7 outline-0 focus:outline-none focus:ring-0`}
            />
          </div>
          <ContactCard />
          <ContactCard />
          <ContactCard />
          <ContactCard />
        </div>

        <div
          className={`flex cursor-pointer items-center justify-center border-t-2 border-gray-shade-3 text-center`}
        >
          <button className={`text-14px p-4 font-medium text-white`}>
            See all Conversations
          </button>
        </div>
      </div>
    </div>
  );
};

// styling
