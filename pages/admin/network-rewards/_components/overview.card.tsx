import React from "react";

const OverviewCards = ({ data }: any) => {
  return (
    <div className="overviewCardsContainer grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
      <div className="card  flex flex-col gap-3 rounded-xl bg-elevation-1 p-6 ">
        <h5 className="text-xs font-semibold text-gray-shade-7">
          Total contributers
        </h5>
        <h6 className="text-sm font-semibold text-white">{`${data.totalBusdContributors} (BUSD)  ${data.totalNtrContributors} (NTR)`}</h6>
      </div>
      <div className="card  flex flex-col gap-3 rounded-xl bg-elevation-1 p-6 ">
        <h5 className="text-xs font-semibold text-gray-shade-7">
          Total Raising BUSD
        </h5>
        <h6 className="text-sm font-semibold text-white">
          {data.totalRaisingBusd}
        </h6>
      </div>
      <div className="card  flex flex-col gap-3 rounded-xl bg-elevation-1 p-6 ">
        <h5 className="text-xs font-semibold text-gray-shade-7">
          Total Raising NTR
        </h5>
        <h6 className="text-sm font-semibold text-white">
          {data.totalRaisingNtr}
        </h6>
      </div>
      <div className="card  flex flex-col gap-3 rounded-xl bg-elevation-1 p-6 ">
        <h5 className="text-xs font-semibold text-gray-shade-7">
          Total CENTHER to be distributed
        </h5>
        <h6 className="text-sm font-semibold text-white">
          {data.totalCentherTobeDistributedFromBusd +
            data.totalCentherTobeDistributedFromNtr}
        </h6>
      </div>
    </div>
  );
};

export default OverviewCards;
