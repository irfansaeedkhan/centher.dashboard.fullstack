import React, { useMemo } from "react";
import { useTable } from "react-table";
import { AdminFeeDetailsData } from "./admin.fee.details.data";
import { Columns } from "./header.columns";

export const AdminFeeDetailsTable = () => {
  const columns = useMemo(() => Columns, []);
  const data = useMemo(() => AdminFeeDetailsData, []);
  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  return (
    <div className="my-4 inline-block h-auto min-w-full overflow-auto rounded-lg border border-gray-shade-3 shadow">
      <table className="min-w-full leading-normal" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr
                className="border-b border-gray-shade-3 text-white"
                key={key}
                {...restHeaderGroupProps}
              >
                {headerGroup.headers.map((column) => {
                  const { key, ...restHeaderProps } = column.getHeaderProps();
                  return (
                    <th
                      className="py-3 pl-4 pr-2  text-left text-xs font-semibold uppercase tracking-wider"
                      key={key}
                      {...restHeaderProps}
                    >
                      <>{column.render("Header")}</>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody
          className="bg-transparent text-sm text-white"
          {...getTableBodyProps()}
        >
          {rows.map((row) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr key={key} {...restRowProps}>
                {row.cells.map((cell) => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return (
                    <td className="px-4 py-3" key={key} {...restCellProps}>
                      <>{cell?.render("Cell")}</>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
