import React, { useMemo } from "react";
import cloneDeep from "clone-deep";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import { NFTListingSingle } from "./nft.listing.single";

interface Props {
  data: CFSNFTForPage["marketplaceSaleHistory"];
}

export const NFTListing: React.FC<Props> = ({ data }) => {
  const sortedData = useMemo(() => {
    let _sortedData = data ? cloneDeep(data) : [];
    _sortedData && _sortedData.length > 0
      ? _sortedData.sort((a, b) => Number(a.txTime) - Number(b.txTime))
      : [];

    return _sortedData;
  }, [data]);

  return !!sortedData.length ? (
    <div className={`w-full`}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item ">
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              className={`accordion-button relative mb-3 flex w-full items-center  rounded-none border-b-2 border-gray-shade-3 !bg-transparent  py-4 text-left text-base font-semibold text-white transition focus:outline-none`}
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
    </div>
  ) : null;
};
