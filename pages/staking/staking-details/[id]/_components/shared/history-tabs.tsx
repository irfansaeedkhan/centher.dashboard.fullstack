import Button from "@/components/button";
import clsx from "clsx";
import React from "react";
import { CgSpinner } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buttons: { title: string; handler: any }[];
  loader: string;
  actionAreaLoading: boolean;
  records?: any[];
}

export const HistoryTabs: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  buttons,
  loader,
  actionAreaLoading,
  records,
}) => {
  return (
    <div className="flex h-[76px] w-full items-center justify-between gap-5 rounded-xl border border-gray-shade-3 bg-[#1A1B21] px-6">
      <div className="flex w-full items-center gap-1.5">
        <div
          className={clsx(
            "text-[min(10vw, 20px)] rounded-xl font-semibold",
            isOpen ? "text-white" : "text-gray-shade-14"
          )}
        >
          {title}
        </div>
        {isOpen ? (
          <div
            className="flex h-6 w-6 flex-shrink-0 cursor-pointer"
            onClick={onClose}
          >
            <IoIosArrowUp className="flex h-6 w-6 flex-shrink-0 text-white" />
          </div>
        ) : (
          <div
            className="flex h-6 w-6 flex-shrink-0 cursor-pointer"
            onClick={onClose}
          >
            <IoIosArrowDown className="flex h-6 w-6 flex-shrink-0 text-gray-shade-14" />
          </div>
        )}
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        {actionAreaLoading ? (
          <>
            <CgSpinner className="h-5 animate-spin text-white" />
          </>
        ) : (
          buttons.map((e: any, i: number) => {
            return (
              <Button
                key={i}
                className="text-sm"
                title={e.title}
                borderRounded="10px"
                onClick={async () => await e.handler(records)}
                disabled={loader?.length > 0}
                loaderIcon={
                  loader == e.title ? (
                    <CgSpinner className="h-5 animate-spin text-white" />
                  ) : undefined
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
};
