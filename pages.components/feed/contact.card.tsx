// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";
import { RightSimpleIcon } from "@/assets/svgs";
export const ContactCard = () => {
  return (
    <div className={contactCard}>
      <div className={contactDetail}>
        <img
          src={"/images/robertProfilepic.png"}
          width="44"
          height="44"
          alt="profile pic"
        />
        <div>
          <h5 className={cdName}>Robert Fox</h5>
          <h6 className={cdTime}>Active 30m ago</h6>
        </div>
      </div>
      <button className={ArrowActBtn}>
        <RightSimpleIcon />
      </button>
    </div>
  );
};

// styling
const contactCard = ctl(`
  flex  items-center  justify-between my-4
`);
const contactDetail = ctl(`
  flex items-center justify-center gap-3
`);
const ArrowActBtn = ctl(`
  w-[20px] h-[20px] rounded-md bg-gray-shade-3 flex items-center justify-center cursor-pointer
`);
const cdName = ctl(`
  text-14px font-semibold text-white pb-1
`);
const cdTime = ctl(`
  text-12px font-ligth text-gray-shade-7
`);
