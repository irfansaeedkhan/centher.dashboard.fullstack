// React, Next, NPM Packages
import React, { useMemo } from "react";

import { IListHistory } from "@/hooks/use.get.nft.data.ts";
import { NFTListingSingle } from "./nft.listing.single";
interface NFTListingProps {
  data: IListHistory[] | undefined;
}

export const NFTListing = ({ data }: NFTListingProps) => {
  const sortedData = useMemo(() => {
    let _sortedData = data ? [...data] : [];
    _sortedData && _sortedData.length > 0
      ? _sortedData.sort((a, b) => Number(a.txTime) - Number(b.txTime))
      : [];

    return _sortedData;
  }, [data]);
  return (
    <div className={`w-full`}>
      {sortedData?.length ? (
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
            <div>
              <div className="accordion-body rounded-10px bg-background-shade-3 p-6">
                <div className={`flex flex-col gap-5`}>
                  {sortedData &&
                    sortedData.map((item, index) => {
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

const AccordionButton = `
accordion-button relative flex items-center w-full py-4  text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`;
