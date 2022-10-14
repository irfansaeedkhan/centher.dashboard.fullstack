// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";

// same directory Imports
import FixedPriceForm from "./fixed.price.form";
import AuctionForm from "./auction.form";

export const CreateNFTForm = () => {
  const [tab, setTab] = useState("Fixed");

  return (
    <div className={CreateNFTFormContainer}>
      <div className={tabsBtnContainer}>
        <Button
          title={"Fixed Price"}
          variant={tab === "Fixed" ? "v1" : "v2"}
          onClick={() => {
            setTab("Fixed");
          }}
          className={`${Tab} ${tab === "Fixed" && activeTab}`}
        />
        <Button
          title={"Auction"}
          variant={tab === "Auction" ? "v1" : "v2"}
          onClick={() => {
            setTab("Auction");
          }}
          className={`${Tab} ${tab === "Auction" && activeTab}`}
        />
      </div>
      {tab === "Fixed" && <FixedPriceForm />}
      {tab === "Auction" && <AuctionForm />}
    </div>
  );
};
// styling
const CreateNFTFormContainer = ctl(`
 bg-black-shade-9 rounded-2xl relative w-full border   border-gray-shade-3 py-8 px-6 flex flex-col gap-6
`);
const tabsBtnContainer = ctl(`
w-full max-w-[290px] flex gap-4
`);
const Tab = ctl(`
w-full py-3 cursor-pointer hover:bg-brand-primary hover:text-black-shade-3
`);
const activeTab = ctl(`
 text-black-shade-3 [&>*>*]:stroke-black-shade-3
`);
const nftBoxContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-6
`);
