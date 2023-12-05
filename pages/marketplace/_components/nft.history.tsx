import { useEffect, useState } from "react";
import moment from "moment";
import { CustomModal } from "@/components/modal/custom.modal";
import { LineChart } from "@/components/charts";
import Button from "@/components/button";
import { formatEther2Number } from "@/utils/format.address";

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
  const [priceAverageList, setPriceAverageList] = useState<number[]>([]);
  const [priceAverage, setPriceAverage] = useState<number>();
  const [priceVolume, setPriceVolume] = useState<number>();
  const [showModal, setShowModal] = useState(false);
  const [tableDataArray, setTableDataArray] = useState<any[]>([]);

  const closePostModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    const getData = async (prices: any) => {
      const _prices = prices.sort(
        (item1: any, item2: any) => item1.txTime - item2.txTime
      );
      const _priceHistory = await _prices.map((item: any) => {
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

      const nthDays = moment().subtract(duration, "days").format("YYYY-MM-DD");

      // setting array of prices adjacent to their dates

      const arrayWithDateProperty = prices.map((obj: any) => {
        return {
          ...obj,
          price: formatEther2Number(obj.price),
          txTime: moment(Number(obj.txTime * 1000)).format("YYYY-MM-DD"),
        };
      });
      const PricesDateArray: { [key: string]: number[] }[] = [];
      arrayWithDateProperty.forEach((item: any, index: any) => {
        if (index === 0) {
          PricesDateArray.push({
            [item.txTime]: [item.price],
          });
        } else {
          const prevSameTime = PricesDateArray.find((i) => i[item.txTime]);
          if (prevSameTime) {
            prevSameTime[item.txTime].push(item.price);
          } else {
            PricesDateArray.push({
              [String(item.txTime)]: [item.price],
            });
          }
        }
      });
      setTableDataArray(PricesDateArray);

      // getting prices array for nth days
      let _priceList: number[] = [];
      let _priceListForGraph: any[] = [];
      let _priceListAverageForGraph: any[] = [];
      await _priceHistory?.forEach((data: any) => {
        let propTime = moment(Number(Object.entries(data)[1][1]) * 1000).format(
          "YYYY-MM-DD"
        );
        if (propTime >= nthDays) {
          _priceList.push(Number(Object.entries(data)[0][1]));
        }
      });
      PricesDateArray?.map((data) => {
        let propTime = moment(Object.entries(data)[0][0]).format("YYYY-MM-DD");
        if (propTime >= nthDays) {
          _priceListForGraph.push(
            Object.entries(data)[0][1].map((data) => Number(data))
          );
        }
      });

      // getting average prices per day
      _priceListForGraph?.map((priceArray) => {
        const _priceArrAverage =
          priceArray.reduce((partialSum: any, a: any) => partialSum + a, 0) /
          priceArray.length;

        _priceListAverageForGraph.push(_priceArrAverage.toFixed(4));
      });
      setPriceAverageList(_priceListAverageForGraph);
      // getting average price
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
        data: priceAverageList,
        backgroundColor: "#fff",
      },
    ],
  };
  const changeDuration = async (e: any) => {
    setDuration((prev) => e.target.value);
  };
  return (
    <div className={`w-full`}>
      {prices?.length ? (
        <div className="accordion" id="accordionExample">
          <div className="accordion-item ">
            <h2 className="accordion-header mb-0" id="headingOne">
              <button className={AccordionButton}>History</button>
            </h2>
            <div>
              <div className="accordion-body rounded-10px bg-background-shade-3">
                <div className={`overflow-x-auto`}>
                  <div className="top flex  justify-between bg-[#1C1F29] px-6 py-3">
                    <div className={graphDetailBox}>
                      <h5 className="text-xs text-white">
                        {duration} days avg. price
                      </h5>
                      <h5 className="textGradient text-sm">
                        {" "}
                        {priceAverage ? priceAverage.toFixed(4) : " No Data"}
                      </h5>
                    </div>
                    <div className={graphDetailBox}>
                      <h5 className="text-xs text-white">
                        {duration} days volume
                      </h5>
                      <h5 className="text-sm text-[#5F97FF]">
                        {" "}
                        {priceVolume ? priceVolume.toFixed(4) : " No Data"}
                      </h5>
                    </div>
                    <select
                      name="days"
                      id="days"
                      className=" rounded-10px bg-[#1C1F29] text-white"
                      onChange={changeDuration}
                      value={duration}
                    >
                      <option value={7}>Last 7 days</option>
                      <option value={30}>Last 30 days</option>
                    </select>
                  </div>
                </div>

                <div className="p-6">
                  {priceHistory.length > 0 ? (
                    <LineChart data={data} />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center">
                      <h6 className="textGradient text-sm font-medium">
                        No event has occured yet!
                      </h6>
                    </div>
                  )}
                </div>

                <div className="flex w-full justify-end p-3">
                  {tableDataArray.length > 0 && (
                    <Button
                      title={"Details"}
                      variant="primary"
                      className="w-max px-6"
                      onClick={() => {
                        setShowModal(true);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showModal && (
        <CustomModal onClose={closePostModal} title={"Price List"}>
          <div className={`relative overflow-x-auto rounded-2xl shadow-md`}>
            <table
              className={`w-full overflow-hidden rounded-2xl border-2 border-gray-shade-3 bg-black-shade-4 text-left text-sm text-gray-500`}
            >
              <thead
                className={`bg-background-shade-3 text-sm uppercase text-gray-shade-7`}
              >
                <tr>
                  <th scope="col" className={th}>
                    Dates
                  </th>
                  <th scope="col" className={th}>
                    Price list
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableDataArray?.map((item: any, index: any) => {
                  return (
                    <tr
                      className={`border-b border-gray-shade-3  odd:bg-black-shade-3 even:bg-black-shade-11`}
                      key={index}
                    >
                      <td className={td}>{Object.keys(item)}</td>
                      <td className={td}>
                        {Object.values(item).map(
                          (pricelist: any) => `${pricelist}  `
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CustomModal>
      )}
    </div>
  );
};
// styling

const AccordionButton = `accordion-button relative flex items-center w-full py-4  text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-sm font-semibold border-b-2 border-gray-shade-3 mb-3`;
const graphDetailBox = `flex flex-col gap-2`;
const th = `py-4 lg:py-7 px-5 lg:px-3`;
const td = `text-sm py-4 lg:py-7 px-5 lg:px-3 text-white font-medium`;
