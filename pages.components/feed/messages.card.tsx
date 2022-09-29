// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";
import { SearchIcon } from "@/assets/svgs";

import { ContactCard } from "./contact.card";
export const MessagesCard = () => {
  return (
    <div className={MessagesCardContainer}>
      <div className={topDetails}>
        <h5 className={MCTitle}>Messages</h5>
        <div className={searchBox}>
          <div className={searchIcon}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by name"
            className={searchIinput}
          />
        </div>
        <ContactCard />
        <ContactCard />
        <ContactCard />
        <ContactCard />
      </div>

      <div className={footerBtnContainer}>
        <button className={footerBtn}>See all Conversations</button>
      </div>
    </div>
  );
};

// styling
const MessagesCardContainer = ctl(`
  w-full max-w-[272px] rounded-10px bg-background-shade-3
`);
const MCTitle = ctl(`
  text-14px font-semibold text-white pb-4
`);
const topDetails = ctl(`
p-4
`);
const searchBox = ctl(`
  mb-4 w-full h-[38px] bg-background-shade-2 rounded-10px  px-10 relative overflow-hidden relative w-full h-[64px] bg-gray-shade-9 border-2 border-gray-shade-3  px-3 py-4
`);
const searchIcon = ctl(`  
  absolute top-[50%] left-[14px] translate-y-[-50%]
`);
const searchIinput = ctl(`
  focus:outline-none focus:ring-0 outline-0 bg-transparent border-0 absolute top-0 left-0 pl-10 h-full text-12px text-gray-shade-7 font-light
`);
const footerBtnContainer = ctl(`
  text-center  cursor-pointer border-t-2 border-gray-shade-3 flex items-center justify-center
`);
const footerBtn = ctl(`
  text-14px  text-white font-medium  p-4     
`);
