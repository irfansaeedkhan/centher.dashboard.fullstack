import Link from "next/link";
import React from "react";

//Current directory imports
import { FeeDetails } from "./admin.fee.details.data";

interface FeeDetailsTableProps {
  feeDetails: FeeDetails;
}

export const AdminFeeDetailsTable: React.FC<FeeDetailsTableProps> = (props) => {
  return (
    <div className="inline-block min-w-full shadow rounded-lg bordersetall overflow-auto my-4 h-auto">
      <table className="min-w-full leading-normal">
        <thead className="headerSett">
          <tr className="bordersetbottom text-white ">
            <th className="pl-4 pr-2 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Public Key
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Transaction Hash
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Transaction Details
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Transaction Valid
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Issue
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Amount In BNB
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Correct In BNB
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              In Difference
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3  text-left text-xs font-semibold uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent text-white text-sm">
          <tr className="bordersetbottom ">
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">{props.feeDetails.Email}</p>
            </td>
            <td className="px-4 py-3  ">
              <Link href="" className="hover:text-yellow-theme">
                {props.feeDetails.Publickey}
              </Link>
            </td>
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">{props.feeDetails.Date}</p>
            </td>
            <td className="px-4 py-3  ">
              <Link className="hover:text-yellow-theme" href="">
                {props.feeDetails.TransactionHash}
              </Link>
            </td>
            <td className="px-4 py-3  ">
              <p className="whitespace-no-wrap">
                {props.feeDetails.TransactionDetail}
              </p>
            </td>
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">
                {props.feeDetails.TransactionValid}
              </p>
            </td>
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">{props.feeDetails.Issue}</p>
            </td>
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">{props.feeDetails.Amount}</p>
            </td>
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">
                {props.feeDetails.AmountInBNB}
              </p>
            </td>
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">
                {props.feeDetails.CorrectInBNB}
              </p>
            </td>
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">
                {props.feeDetails.InDifference}
              </p>
            </td>
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">{props.feeDetails.Status}</p>
            </td>
            <td className="px-4 py-3  ">
              <p className=" whitespace-no-wrap">{props.feeDetails.Action}</p>
            </td>
          </tr>
        </tbody>
        );
      </table>
      <div className="px-4 py-2 bg-transparent border-t flex flex-col xs:flex-row items-end justify-end ">
        <div className="inline-flex gap-2 mt-2 xs:mt-0">
          <span className="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">
            1
          </span>
        </div>
      </div>
    </div>
  );
};
