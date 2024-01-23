import React from "react";
import { dummyDataArray } from "./data";
import { FirstLastTimeline, NumberTimeline } from "./";

export const MainTimeline = () => {
  return (
    <div className="flex flex-col gap-3">
      <FirstLastTimeline
        title="4 months Lock Period will End in"
        para="DXC tokens will be released 12,5% monthly."
        endTime={new Date("2025-10-10T00:00:00")}
      />
      <div className="flex flex-col gap-1">
        {dummyDataArray.map((data, index) => (
          <NumberTimeline key={index} {...data} />
        ))}
      </div>
      <FirstLastTimeline
        title="Total 20000CTHR will be released in"
        para="Calculated on the total DXC tokens that is expected to be released within the given time frame."
        endTime={new Date("2025-10-10T00:00:00")}
      />
    </div>
  );
};
