// React, Next, NPM Packages
import { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import moment from "moment";

// App import
import { LineChart } from "@/components/charts";
import { IListHistory } from "@/hooks/use.get.nft.data.ts";

interface NFTHistoryProps {
  data: IListHistory[] | undefined;
}
export const NFTHistory = () => {
  const [duration, setDuration] = useState("");
  // interface of data to be sent in chart
  interface historyData {
    labels: string[];
    datasets: {
      type: "line";
      label: string;
      borderColor: string;
      borderWidth: number;
      fill: boolean;
      data: number[];
      backgroundColor: string;
    }[];
  }
  // dummy data
  const priceHistory = [
    {
      price: 0.01,
      txTime: 1667127672,
    },
    {
      price: 0.1,
      txTime: 1667129672,
    },
    {
      price: 1,
      txTime: 1667137672,
    },
    {
      price: 2,
      txTime: 1667147672,
    },
  ];
  // global labels to set dynamic data
  let labels: string[] = [];
  let priceList: number[] = [];
  let averagePrice: number | undefined;
  // getting dynamic labels data using moment js for last 7 days
  for (let i = 0; i < 7; i++) {
    labels.push(moment().subtract(i, "days").format("DD MMM"));
  }
  // using momentjs to get current date and previous dates
  // const currentTime = moment().format("YYYY-MM-DD");
  const lastSeventhDay = moment().subtract(7, "days").format("YYYY-MM-DD");

  // getting prices array for last 7 days from dummy data
  priceHistory.forEach((data) => {
    let propTime = moment(Number(Object.entries(data)[1][1]) * 1000).format(
      "YYYY-MM-DD"
    );
    if (propTime >= lastSeventhDay) {
      priceList.push(Number(Object.entries(data)[0][1]));
    }
  });
  // getting average price from pricelist for last 7 days
  averagePrice =
    priceList.reduce((partialSum, a) => partialSum + a, 0) / priceList.length;
  // const lastThirtyDayFunc = () => {
  //   // getting dynamic labels data using moment js for last 7 days
  //   for (let i = 0; i < 30; i++) {
  //     labels.push(moment().subtract(i, "days").format("DD MMM"));
  //   }
  //   // using momentjs to get current date and previous dates
  //   const lastThirtiethDay = moment().subtract(30, "days").format("YYYY-MM-DD");

  //   // getting prices array for last 7 days from dummy data
  //   priceHistory.forEach((data) => {
  //     let propTime = moment(Number(Object.entries(data)[1][1]) * 1000).format(
  //       "YYYY-MM-DD"
  //     );
  //     if (propTime >= lastThirtiethDay) {
  //       priceList.push(Number(Object.entries(data)[0][1]));
  //     }
  //   });
  //   // getting average price from pricelist for last 7 days
  //   averagePrice =
  //     priceList.reduce((partialSum, a) => partialSum + a, 0) / priceList.length;
  // };
  console.log(labels);
  const data: historyData = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "last 7 days",
        borderColor: "#5F97FF",
        borderWidth: 2,
        fill: false,
        data: priceList,
        backgroundColor: "#fff",
      },
    ],
  };
  // interface historyData {
  //   labels: string[];
  //   datasets: {
  //     type: "line";
  //     label: string;
  //     borderColor: string;
  //     borderWidth: number;
  //     fill: boolean;
  //     data: number[];
  //     backgroundColor: string;
  //   }[];
  // }
  // interface chartDataParams {
  //   dynamicLabels: string[];
  //   priceList: number[];
  //   averagePrice: number | undefined;
  // }
  // const [chartData, setChartData] = useState<chartDataParams>({
  //   dynamicLabels: [],
  //   priceList: [],
  //   averagePrice: undefined,
  // });
  // const [duration, setDuration] = useState({
  //   timeFrame: "Last7Days",
  // });
  const changeDuration = async (e: any) => {
    setDuration((prev) => e.target.value);

    // if (duration === "Last7Days") {
    //   lastSevenDayFunc();
    // } else if (duration === "Last7Days") {
    //   lastThirtyDayFunc();
    // }
  };

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
                    <h5 className="text-14px text-yellow-theme">
                      {" "}
                      ={averagePrice && averagePrice.toFixed(4)}
                    </h5>
                  </div>
                  <div className={graphDetailBox}>
                    <h5 className="text-12px text-white">7 days volume</h5>
                    <h5 className="text-14px text-[#5F97FF]"> =0.0348</h5>
                  </div>
                  <select
                    name="days"
                    id="days"
                    className="bg-transparent text-white rounded-10px"
                    onChange={changeDuration}
                    value={duration}
                  >
                    <option value="Last7Days">Last 7 days</option>
                    <option value="Last30Days">Last 30 days</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                <LineChart data={data} />
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
