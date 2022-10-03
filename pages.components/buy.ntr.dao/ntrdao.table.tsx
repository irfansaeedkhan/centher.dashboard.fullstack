// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// app imports
import Button from "@/components/button";

export const NTRDAOTable = () => {
  return (
    <div className={nftdaoTableContainer}>
      <table className={table}>
        <thead className={thead}>
          <tr>
            <th scope="col" className={th}>
              #
            </th>
            <th scope="col" className={th}>
              Purchase date
            </th>
            <th scope="col" className={th}>
              BUSD paid amount
            </th>
            <th scope="col" className={th}>
              BUSD NTRDOA amount
            </th>
            <th scope="col" className={th}>
              Bonus
            </th>
            <th scope="col" className={th}>
              Lock months
            </th>
            <th scope="col" className={th}>
              Time remaining
            </th>
            <th scope="col" className={th}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className={tbodyTR}>
            <td className={tdh}>1</td>
            <td className={td}>1/10/2022</td>
            <td className={td}>1000 BUSD</td>
            <td className={td}>2 NTRDAO</td>
            <td className={td}>1.2 NTRDAO</td>
            <td className={td}>6</td>
            <td className={td}>176 days</td>
            <td className={td}>
              <Button
                title={"Claim"}
                variant="v1"
                className="max-w-[80px]"
                onClick={() => {
                  console.log("work");
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// stying

const nftdaoTableContainer = ctl(` 
overflow-x-auto relative  shadow-md rounded-2xl mt-8 lg:mt-12
`);
const table = ctl(` 
overflow-hidden w-full border-2 rounded-2xl border-gray-shade-3 text-sm text-left text-gray-500 bg-black-shade-4
`);
const thead = ctl(` 
text-14px text-gray-shade-7 uppercase bg-background-shade-3 
`);
const th = ctl(` 
py-4 lg:py-7 px-5 lg:px-3
`);
const tbodyTR = ctl(` 
border-b border-gray-shade-3  odd:bg-black-shade-3 even:bg-black-shade-11
`);
const td = ctl(` 
text-14px py-4 lg:py-7 px-5 lg:px-3 text-white font-medium
`);
const tdh = ctl(` 
text-16px py-4 lg:py-7 px-5 lg:px-3 text-white font-semi-bold
`);
