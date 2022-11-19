// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
import { IListHistory } from "@/hooks/use.get.nft.data.ts";
import { formatAddress } from "@/utils/format.address";
import useGetUser from "@/hooks/use.get.user";
interface NFTListingProps {
  data: IListHistory[] | undefined;
}

export const NFTListing = ({ data }: NFTListingProps) => {
  return (
    <div className={NFTlistingsContainer}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item bg-transparent ">
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              className={AccordionButton}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#listingsComponent"
              aria-expanded="true"
              aria-controls="listingsComponent"
            >
              Listing
            </button>
          </h2>
          <div
            id="listingsComponent"
            className={AccordionCollapse}
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-6">
              <div className={listingsList}>
                {data &&
                  data.map((item, index) => {
                    let prefix = "Listed";
                    if (item.type === "ListForSale") {
                      prefix = "Listed";
                    } else if (item.type === "CancelForSale") {
                      prefix = "Canceled";
                    } else if (item.type === "EditForSale") {
                      prefix = "Price Changed";
                    } else if (item.type === "CreateAuction") {
                      prefix = "Auction Created";
                    } else if (
                      item.type === "BuyItem" ||
                      item.type === "AcceptBid" ||
                      item.type === "EndAuction"
                    ) {
                      prefix = "Bought";
                    } else {
                      return;
                    }
                    return (
                      <div className={listingBox} key={index}>
                        <div className={circle}></div>
                        <div className="flex flex-col gap-3">
                          <h5 className={title}>
                            {prefix} by{" "}
                            <span className="font-semibold">
                              {item.type === "BuyItem" || item.type === "AcceptBid" || item.type === "EndAuction" ? formatAddress(item.buyer) : formatAddress(item.seller)}
                            </span>
                          </h5>
                          <h6 className={date}>
                            {new Date(item.txTime * 1000).toString()}
                          </h6>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// styling
const NFTlistingsContainer = ctl(`
w-full 
`);
const AccordionButton = ctl(`
accordion-button relative flex items-center w-full py-4 px-5 text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`);
const AccordionCollapse = ctl(`
accordion-collapse collapse show bg-background-shade-3 rounded-10px
`);
const listingBox = ctl(`
flex  gap-3
`);
const circle = ctl(`
w-2 h-2 rounded-full bg-yellow-theme mt-[3px]
`);
const title = ctl(`
text-white  text-12px font-normal
`);
const date = ctl(`
text-12px text-gray-shade-2 font-normal
`);
const listingsList = ctl(`
flex flex-col gap-5
`);
