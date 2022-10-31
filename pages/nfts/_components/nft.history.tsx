// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// App import
import { LineChart } from "@/components/charts";
import { IListHistory } from "@/hooks/use.get.nft.data.ts";
let chartData = {
  // x-axis label values
  labels: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  datasets: [
    {
      label: "# of Calories Lost",
      // y-axis data plotting values
      data: [200, 300, 1300, 520, 2000, 350, 150],
      fill: false,
      borderWidth: 4,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "green",
      responsive: true,
    },
  ],
};
interface NFTHistoryProps {
  data: IListHistory[] | undefined;
}
export const NFTHistory = ({ data }: NFTHistoryProps) => {
  return (
    <div className={NFTHistoryContainer}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item bg-transparent ">
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              className={AccordionButton}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#HistoryComponent"
              aria-expanded="true"
              aria-controls="HistoryComponent"
            >
              History
            </button>
          </h2>
          <div
            id="HistoryComponent"
            className={AccordionCollapse}
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body rounded-10px">
              <div className={graphContainer}>
                <div className="top flex  justify-between bg-[#1C1F29] px-6 py-3">
                  <div className={graphDetailBox}>
                    <h5 className="text-12px text-white">7 days avg. price</h5>
                    <h5 className="text-14px text-yellow-theme"> =0.0348</h5>
                  </div>
                  <div className={graphDetailBox}>
                    <h5 className="text-12px text-white">7 days volume</h5>
                    <h5 className="text-14px text-[#5F97FF]"> =0.0348</h5>
                  </div>
                  <select
                    name="days"
                    id="days"
                    className="bg-transparent text-white rounded-10px"
                  >
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="Last 7 days">Last month</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                <LineChart history={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// styling
const NFTHistoryContainer = ctl(`
w-full 
`);
const AccordionButton = ctl(`
accordion-button relative flex items-center w-full py-4 px-5 text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`);
const AccordionCollapse = ctl(`
accordion-collapse collapse show bg-[#1B1C22] border-2 rounded-10px  border-gray-shade-3
`);
const graphContainer = ctl(`
overflow-x-auto  
`);
const graphDetailBox = ctl(`
flex flex-col gap-2
`);
