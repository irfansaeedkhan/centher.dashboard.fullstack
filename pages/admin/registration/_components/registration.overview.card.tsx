import React from "react";

const RegistrationOverviewCards = ({
  totalMembers,
  membersWithoutReferrer,
  membersWithReferrer,
}: any) => {
  return (
    <div className="overviewCardsContainer grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
      <div className="card  flex flex-col gap-3 rounded-xl bg-elevation-1 p-6 ">
        <h5 className="text-xs font-semibold text-gray-shade-7">
          Total Members
        </h5>
        <h6 className="text-sm font-semibold text-white">{totalMembers}</h6>
      </div>
      <div className="card  flex flex-col gap-3 rounded-xl bg-elevation-1 p-6 ">
        <h5 className="text-xs font-semibold text-gray-shade-7">
          Total Members Without Referrer
        </h5>
        <h6 className="text-sm font-semibold text-white">
          {membersWithoutReferrer}
        </h6>
      </div>
      <div className="card  flex flex-col gap-3 rounded-xl bg-elevation-1 p-6 ">
        <h5 className="text-xs font-semibold text-gray-shade-7">
          Total Members With Referrer
        </h5>
        <h6 className="text-sm font-semibold text-white">
          {membersWithReferrer}
        </h6>
      </div>
    </div>
  );
};

export default RegistrationOverviewCards;
