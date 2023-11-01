// React, Next, NPM Packages
import Image from "next/image";

export const RecentActivitiesCard = () => {
  return (
    <div className="w-full max-w-[272px] rounded-10px bg-background-shade-3 p-4 pb-2">
      <h5 className="pb-6 text-sm font-semibold text-white">
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

const RATime = `text-sm font-light text-white`;
const RAName = `text-sm font-semibold text-white`;
const cdTime = `text-xs font-ligth text-gray-shade-7`;
const RADetail = `flex items-center justify-center gap-3 pb-4`;
