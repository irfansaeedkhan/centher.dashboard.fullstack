import React from "react";

const RegistrationOverviewCards = ({
  totalMembers,
  membersWithoutReferrer,
  membersWithReferrer,
}: any) => {
  return (
    <div className="overviewCardsContainer grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
      <div className="card  bg-elevation-1 p-6 rounded-xl flex flex-col gap-3 ">
        <h5 className="text-gray-shade-7 text-12px font-semibold">
          Total Members
        </h5>
        <h6 className="text-14px font-semibold text-white">{totalMembers}</h6>
      </div>
      <div className="card  bg-elevation-1 p-6 rounded-xl flex flex-col gap-3 ">
        <h5 className="text-gray-shade-7 text-12px font-semibold">
          Total Members Without Referrer
        </h5>
        <h6 className="text-14px font-semibold text-white">
          {membersWithoutReferrer}
        </h6>
      </div>
      <div className="card  bg-elevation-1 p-6 rounded-xl flex flex-col gap-3 ">
        <h5 className="text-gray-shade-7 text-12px font-semibold">
          Total Members With Referrer
        </h5>
        <h6 className="text-14px font-semibold text-white">
          {membersWithReferrer}
        </h6>
      </div>
    </div>
  );
};

export default RegistrationOverviewCards;
