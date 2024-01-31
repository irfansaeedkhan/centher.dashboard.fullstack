import React, { useRef, useState } from "react";
import clsx from "clsx";
import { useOnClickOutside } from "usehooks-ts";
import { BsThreeDots } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Button from "@/components/button";

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
  const ref = useRef<HTMLDivElement>(null);
  const [buttonPopup, setButtonPopup] = useState(false);

  useOnClickOutside(ref, () => setButtonPopup(false));

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
      <div className="hidden flex-shrink-0 items-center gap-2 fmd:flex">
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
      {buttons.length > 0 && (
        <div className="relative flex flex-shrink-0 fmd:hidden">
          <span onClick={() => setButtonPopup(!buttonPopup)}>
            <BsThreeDots className="size-6 cursor-pointer text-gray-shade-14 hover:text-white" />
          </span>
          {buttonPopup && (
            <div
              ref={ref}
              className="absolute right-0 top-8 h-auto w-[200px] rounded-lg bg-popup-0"
            >
              <div className="flex flex-col gap-2 p-4">
                {buttons.map((e: any, i: number) => {
                  return (
                    <Button
                      key={i}
                      className="text-xs"
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
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
