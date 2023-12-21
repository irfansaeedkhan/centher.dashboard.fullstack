import dayjs from "dayjs";
import React from "react";

interface Props {
  total_selling_amount: string | number;
  soft_cap_busd: string | number;
  start_time: Date | null;
  end_time: Date | null;
}

const PreviwCommonComponent: React.FC<Props> = ({
  total_selling_amount,
  soft_cap_busd,
  start_time,
  end_time,
}) => {
  return (
    <>
      <div className={roundMainDiv}>
        <h6 className={h6Text}>Total Selling amount</h6>
        <span className={spanText2}>{total_selling_amount}</span>
      </div>
      <div className={roundMainDiv}>
        <h6 className={h6Text}>Soft cap</h6>
        <span className={spanText2}>{soft_cap_busd}</span>
      </div>
      <div className={roundMainDiv}>
        <h6 className={h6Text}>Start Time</h6>
        <span className={spanText2}>
          {dayjs(start_time).format("ddd DD-MMM-YYYY")}
        </span>
      </div>
      <div className={roundMainDiv}>
        <h6 className={h6Text}>End Time</h6>
        <span className={spanText2}>
          {dayjs(end_time).format("ddd DD-MMM-YYYY")}
        </span>
      </div>
    </>
  );
};

export default PreviwCommonComponent;

const h6Text = "text-sm text-gray-shade-18";
const spanText2 = "text-sm font-semibold text-white";
const roundMainDiv = "flex w-full items-center justify-between gap-3";
