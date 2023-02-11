// React, Next, NPM Packages
import Image from "next/image";

// App imports
import { RightSimpleIcon } from "@/assets/svgs";

export const ContactCard = () => {
  return (
    <div
      className={`
  my-4  flex  items-center justify-between
`}
    >
      <div
        className={`
  flex items-center justify-center gap-3
`}
      >
        <Image
          src={"/images/robertProfilepic.png"}
          width={44}
          height={44}
          alt="profile pic"
        />
        <div>
          <h5
            className={`
  text-14px pb-1 font-semibold text-white
`}
          >
            Robert Fox
          </h5>
          <h6
            className={`
  text-12px font-ligth text-gray-shade-7
`}
          >
            Active 30m ago
          </h6>
        </div>
      </div>
      <button
        className={`
  flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-md bg-gray-shade-3
`}
      >
        <RightSimpleIcon />
      </button>
    </div>
  );
};
