// React, Next, NPM Packages
import { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import moment from "moment";

// App import
import { LineChart } from "@/components/charts";
import { IListHistory } from "@/hooks/use.get.nft.data.ts";
import { formatEther2Number } from "@/utils/format.address";
import { BarChart } from "@/components/charts/bar.chart";

interface NFTHistoryProps {
  prices: IListHistory[] | undefined;
}
interface PriceHistory {
  price: number;
  txTime: number;
}
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

// export const NFTHistory = ({ prices }: NFTHistoryProps) => {
export const NFTHistory = ({ prices }: any) => {
  const [duration, setDuration] = useState(7);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

  // global labels to set dynamic data
  const [labels, setLabels] = useState<string[]>([]);
  const [priceList, setPriceList] = useState<number[]>([]);
  const [priceAverage, setPriceAverage] = useState<number>();
  const [priceVolume, setPriceVolume] = useState<number>();

  useEffect(() => {
    const getData = async (prices: any) => {
      const _prices = prices.sort(
        (item1: any, item2: any) => item1.txTime - item2.txTime
      );
      const _priceHistory = await _prices.map((item: IListHistory) => {
        return {
          price: formatEther2Number(item.price),
          txTime: item.txTime,
        };
      });
      setPriceHistory(_priceHistory);

      // getting dynamic labels data using moment js for last 7 days
      let _labels = [];
      for (let i = 0; i < duration; i++) {
        _labels.push(moment().subtract(i, "days").format("DD MMM"));
      }
      setLabels(_labels);
      // using momentjs to get current date and previous dates
      // const currentTime = moment().format("YYYY-MM-DD");
      const nthDays = moment().subtract(duration, "days").format("YYYY-MM-DD");

      // setting array of prices adjacent to their dates
      const arrayWithDateProperty = prices.map((obj: any) => {
        return {
          ...obj,
          price: formatEther2Number(obj.price),
          txTime: moment(Number(obj.txTime * 1000)).format("YYYY-MM-DD"),
        };
      });
      const modifedData: { [key: string]: number[] }[] = [];
      arrayWithDateProperty.forEach((item: any, index: any) => {
        if (index === 0) {
          modifedData.push({
            [item.txTime]: [item.price],
          });
        } else {
          const prevSameTime = modifedData.find((i) => i[item.txTime]);
          if (prevSameTime) {
            prevSameTime[item.txTime].push(item.price);
          } else {
            modifedData.push({
              [item.txTime]: [item.price],
            });
          }
        }
      });
      console.log("modifedData:::", modifedData);

      // getting prices array for last 7 days from dummy data
      let _priceList: number[] = [];
      let _priceListForGraph: any[] = [];
      await _priceHistory?.forEach((data: any) => {
        let propTime = moment(Number(Object.entries(data)[1][1]) * 1000).format(
          "YYYY-MM-DD"
        );
        if (propTime >= nthDays) {
          _priceList.push(Number(Object.entries(data)[0][1]));
        }
      });
      modifedData?.map((data) => {
        let propTime = moment(Object.entries(data)[0][0]).format("YYYY-MM-DD");
        if (propTime >= nthDays) {
          _priceListForGraph.push(
            Object.entries(data)[0][1].map((data) => Number(data))
          );
        }
      });
      console.log("_priceListForGraph:::", _priceListForGraph);
      setPriceList(_priceList);
      // getting average price from pricelist for last 7 days
      const _priceAverage =
        _priceList.reduce((partialSum, a) => partialSum + a, 0) /
        _priceList.length;
      // getting volume
      const _priceVolume = _priceList.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
      setPriceAverage(_priceAverage);
      setPriceVolume(_priceVolume);
    };
    if (prices) {
      getData(prices);
    }
  }, [duration, prices]);

  console.log("priceList:::", priceList);

  // data to be sent in graph
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
  const changeDuration = async (e: any) => {
    setDuration((prev) => e.target.value);
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
                    <h5 className="text-12px text-white">
                      {duration} days avg. price
                    </h5>
                    <h5 className="text-14px text-yellow-theme">
                      {" "}
                      ={priceAverage ? priceAverage.toFixed(4) : "NAN"}
                    </h5>
                  </div>
                  <div className={graphDetailBox}>
                    <h5 className="text-12px text-white">
                      {duration} days volume
                    </h5>
                    <h5 className="text-14px text-[#5F97FF]">
                      {" "}
                      ={priceVolume ? priceVolume.toFixed(4) : "NAN"}
                    </h5>
                  </div>
                  <select
                    name="days"
                    id="days"
                    className=" text-white bg-[#1C1F29] rounded-10px"
                    onChange={changeDuration}
                    value={duration}
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                  </select>
                </div>
              </div>
              {/* 
              <div className="p-6">
                {priceHistory.length > 0 ? (
                  <LineChart data={data} />
                ) : (
                  <div className="w-full h-28 flex items-center justify-center">
                    <h6 className="text-14px font-medium text-yellow-theme">
                      No data found yet
                    </h6>
                  </div>
                )}
              </div> */}
              <div className="p-6">
                <BarChart />
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
