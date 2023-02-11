// React, Next, NPM Packages
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

export const RecentActivitiesCard = () => {
  return (
    <div
      className={`
  w-full max-w-[272px] rounded-10px bg-background-shade-3 p-4 pb-2
`}
    >
      <h5
        className={`
  text-14px pb-6 font-semibold text-white
`}
      >
        Recent activities
      </h5>
      <div className={RADetail}>
        <Image
          src={"/images/robertProfilepic.png"}
          width={44}
          height={44}
          alt="profile pic"
        />
        <h3 className={RAName}>
          Albert flores <span className={RATime}>start following you</span>{" "}
          <span className={cdTime}>17 m</span>
        </h3>
      </div>
      <div className={RADetail}>
        <Image
          src={"/images/robertProfilepic.png"}
          width={44}
          height={44}
          alt="profile pic"
        />
        <h3 className={RAName}>
          Albert flores <span className={RATime}>start following you</span>{" "}
          <span className={cdTime}>17 m</span>
        </h3>
      </div>
      <div className={RADetail}>
        <Image
          src={"/images/robertProfilepic.png"}
          width={44}
          height={44}
          alt="profile pic"
        />
        <h3 className={RAName}>
          Niha kakar <span className={RATime}>posted new shot</span>{" "}
          <span className={cdTime}>12 m</span>
        </h3>
      </div>
    </div>
  );
};

// styling

const RADetail = `
  flex items-center justify-center gap-3 pb-4
`;
const RAName = `
  text-14px font-semibold text-white 
`;
const RATime = `
  text-14px font-light text-white 
`;
const cdTime = `
  text-12px font-ligth text-gray-shade-7
`;
