import { SearchIcon } from "@/assets/svgs";
import clsx from "clsx";

import { ContactCard } from "./contact.card";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const MessagesCard: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(`max-w-[272px] relative select-none`, className)}
      {...props}
    >
      <div className="absolute z-50 flex flex-col items-center h-full justify-center">
        <h2 className="animationTextHeading !text-base">Coming Soon</h2>
        <p className="text-xs text-white text-center font-medium">
          Calm Down! We are bringing new expereince for you
        </p>
      </div>
      <div className={`rounded-10px bg-background-shade-3 blur-sm relative`}>
        <div className={`p-4`}>
          <h5 className={`text-14px font-semibold text-white pb-4`}>
            Messages
          </h5>
          <div
            className={`mb-4 w-full h-[38px] bg-background-shade-2 rounded-10px relative overflow-hidden border-2 border-gray-shade-3  px-3 py-4`}
          >
            <div
              className={`absolute top-[50%] left-[14px] translate-y-[-50%]`}
            >
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name"
              className={`focus:outline-none focus:ring-0 outline-0 bg-transparent border-0 absolute top-0 left-0 pl-10 h-full text-12px text-gray-shade-7 font-light`}
            />
          </div>
          <ContactCard />
          <ContactCard />
          <ContactCard />
          <ContactCard />
        </div>

        <div
          className={`text-center cursor-pointer border-t-2 border-gray-shade-3 flex items-center justify-center`}
        >
          <button className={`text-14px text-white font-medium p-4`}>
            See all Conversations
          </button>
        </div>
      </div>
    </div>
  );
};

// styling
