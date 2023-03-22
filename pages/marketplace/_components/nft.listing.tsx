// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
import { IListHistory } from "@/hooks/use.get.nft.data.ts";
import { NFTListingSingle } from "./nft.listing.single";
interface NFTListingProps {
  data: IListHistory[] | undefined;
}

export const NFTListing = ({ data }: NFTListingProps) => {
  return (
    <div className={NFTlistingsContainer}>
      {data?.length ? (
        <div className="accordion" id="accordionExample">
          <div className="accordion-item ">
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
            // id="listingsComponent"
            // className={AccordionCollapse}
            // aria-labelledby="headingOne"
            // data-bs-parent="#accordionExample"
            >
              <div className="accordion-body rounded-10px bg-background-shade-3 p-6">
                <div className={listingsList}>
                  {data &&
                    data.map((item, index) => {
                      return <NFTListingSingle item={item} key={index} />;
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
// styling
const NFTlistingsContainer = ctl(`
w-full 
`);
const AccordionButton = ctl(`
accordion-button relative flex items-center w-full py-4  text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`);
const AccordionCollapse = ctl(`
accordion-collapse collapse show bg-background-shade-3 rounded-10px
`);

const listingsList = ctl(`
flex flex-col gap-5
`);
