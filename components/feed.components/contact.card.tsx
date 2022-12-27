// React, Next, NPM Packages
import Image from "next/image";

// App imports
import { RightSimpleIcon } from "@/assets/svgs";

export const ContactCard = () => {
  return (
    <div
      className={`
  flex  items-center  justify-between my-4
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
  text-14px font-semibold text-white pb-1
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
  w-[20px] h-[20px] rounded-md bg-gray-shade-3 flex items-center justify-center cursor-pointer
`}
      >
        <RightSimpleIcon />
      </button>
    </div>
  );
};
