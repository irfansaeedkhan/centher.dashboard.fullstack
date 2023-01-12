// React, Next, NPM Packages
import React, { MouseEvent, useRef } from "react";
import type { InteractionItem } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Chart,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from "react-chartjs-2";
import { IListHistory } from "@/hooks/use.get.nft.data.ts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [10, 23, 45, 69],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [10, 23, 45, 69],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};
interface BarChartPros {
  history: IListHistory[] | undefined;
}

// export const BarChart = ({ history }: BarChartPros) => {
export const BarChart = () => {
  const printDatasetAtEvent = (dataset: InteractionItem[]) => {
    if (!dataset.length) return;

    const datasetIndex = dataset[0].datasetIndex;
  };

  const printElementAtEvent = (element: InteractionItem[]) => {
    if (!element.length) return;

    const { datasetIndex, index } = element[0];
  };

  const printElementsAtEvent = (elements: InteractionItem[]) => {
    if (!elements.length) return;
  };

  const chartRef = useRef<ChartJS>(null);

  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }

    printDatasetAtEvent(getDatasetAtEvent(chart, event));
    printElementAtEvent(getElementAtEvent(chart, event));
    printElementsAtEvent(getElementsAtEvent(chart, event));
  };
  return (
    // <Chart
    //   ref={chartRef}
    //   type="line"
    //   onClick={onClick}
    //   options={options}
    //   data={data}
    // />
    <Chart
      ref={chartRef}
      type="bar"
      onClick={onClick}
      options={options}
      data={data}
    />
    // <Bar options={options} data={data} />
  );
};
