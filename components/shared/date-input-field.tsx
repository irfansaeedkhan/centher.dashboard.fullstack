import React from "react";
import clsx from "clsx";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Datepicker } from "@aliakbarazizi/headless-datepicker";
import cn from "@/utils/cn";
import Button from "@/components/button";

interface Props {
  type: "date" | "time" | "datetime";
  title: string;
  value: Date | null;
  handleChangeEvent: (e: Date | null) => void;
}

export const DateInputField: React.FC<Props> = ({
  type,
  handleChangeEvent,
  value,
  title,
}) => {
  return (
    <div className={gradientBorderInputMain}>
      <label htmlFor="start_time" className={label}>
        {title}
        <span className={labelSpan}>*</span>
      </label>
      <div className={gradientBorderInputParent}>
        <Datepicker onChange={handleChangeEvent} value={value}>
          <Datepicker.Input
            format={
              type === "date"
                ? "mm/dd/yyyy"
                : type === "time"
                ? "hh:mm"
                : "mm/dd/yyyy hh:mm"
            }
            placeholder="Select Date and Time"
            className={gradientBorderInput}
          />
          <Datepicker.Picker
            defaultType="day"
            className={clsx(
              "!top-[-28rem] z-[100] max-w-[250px] !transform-none border border-gray-shade-3 !bg-black-shade-8 pb-4 !will-change-auto fsm:max-w-[300px] flg:max-w-[368px]",
              type === "date" ? "rounded-lg" : "rounded-bl-lg rounded-tl-lg"
            )}
          >
            {({ monthName, hour, minute, year }) => (
              <>
                <div className="flex h-14 w-full items-center justify-between gap-3 border-b border-gray-shade-3 px-2 pb-2 pt-4 rtl:space-x-reverse fsm:gap-6 flg:px-4">
                  <Datepicker.Button
                    action="prev"
                    className="flex h-5 w-5 flex-shrink-0 items-center rounded-full hover:text-white fsm:hover:bg-gray-700"
                  >
                    <FiChevronLeft />
                  </Datepicker.Button>
                  <div className="flex gap-3">
                    <span
                      // action="toggleHourPicker"
                      className="leading-2 flex items-center space-x-2 text-xs font-semibold text-white"
                    >
                      {("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2)}
                    </span>
                    <Datepicker.Button
                      action="toggleMonth"
                      className="leading-2 text-xs font-semibold text-white fsm:text-sm"
                    >
                      {monthName}
                    </Datepicker.Button>
                    <Datepicker.Button
                      action="toggleYear"
                      className="leading-2 text-xs font-semibold text-white"
                    >
                      {year}
                    </Datepicker.Button>
                  </div>
                  <Datepicker.Button
                    action="next"
                    className="flex h-5 w-5 flex-shrink-0 items-center rounded-full hover:text-white fsm:hover:bg-gray-700"
                  >
                    <FiChevronRight />
                  </Datepicker.Button>
                </div>
                <Datepicker.Items
                  className={({ type }) =>
                    cn(
                      "grid w-full auto-rows-max gap-2 overflow-y-auto scroll-smooth px-2 pt-3 fsm:gap-4 fsm:px-4",
                      type == "day" && "grid-cols-7",
                      type == "month" && "grid-cols-3",
                      type == "year" && "max-h-[274px] grid-cols-4"
                    )
                  }
                >
                  {({ items }) =>
                    items.map((item) => (
                      <Datepicker.Item
                        key={item.key}
                        item={item}
                        className={cn(
                          "grid select-none items-center justify-center rounded-full text-xs font-medium fsm:text-sm",
                          item.isHeader
                            ? "cursor-default"
                            : "hover:bg-gray-700",
                          item.disabled ? "text-gray-500" : "hover:text-white",
                          item.type === "day" && "h-8 w-8",
                          item.isSelected &&
                            "gradient-border-5 bg-transparent p-[1px]",
                          item.isToday && "border border-gray-500"
                        )}
                        action={
                          item.type === "day"
                            ? "close"
                            : item.type === "month"
                            ? "showDay"
                            : "showMonth"
                        }
                      >
                        <span
                          className={clsx(item.isSelected && "textGradient")}
                        >
                          {item.isHeader
                            ? item.text.substring(0, 2)
                            : item.text}
                        </span>
                      </Datepicker.Item>
                    ))
                  }
                </Datepicker.Items>
                <Datepicker.Button
                  action="today"
                  className="mt-4 w-full p-2 px-4 text-sm font-medium"
                >
                  <Button
                    className="w-full"
                    title="Today"
                    variant="primary"
                    borderRounded="8px"
                  />
                </Datepicker.Button>
                <Datepicker.Picker
                  className="absolute right-[-101px] top-0 z-50 flex max-h-full w-[100px] transform-none flex-col rounded-br-lg rounded-tr-lg border border-l-0 border-gray-shade-3 !bg-black-shade-8 pb-2 !will-change-auto flg:right-[-131px] flg:w-[130px]"
                  id="HourPicker"
                  alwaysOpen={type === "date" ? false : true}
                >
                  <div className="mx-auto flex min-h-[56px] w-full items-center justify-center border-b border-gray-shade-3 text-lg font-semibold">
                    <span className="textGradient w-fit">Time</span>
                  </div>
                  <div className="flex justify-between gap-2 px-2 pt-3 flg:px-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-xs fsm:text-sm">
                      HH
                    </span>
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-xs fsm:text-sm">
                      MM
                    </span>
                  </div>
                  <div className="flex max-h-full overflow-y-auto">
                    <Datepicker.Items
                      type="hour"
                      className="overflow-y-auto scroll-smooth px-2 flg:px-4"
                      disableAutoScroll
                    >
                      {({ items }) =>
                        items.map((item) => (
                          <Datepicker.Item
                            key={item.key}
                            item={item}
                            action="close"
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium hover:bg-gray-700 hover:text-white fsm:text-sm",
                              item.isSelected &&
                                "gradient-border-5 bg-transparent p-[1px]"
                            )}
                          >
                            <span
                              className={clsx(
                                item.isSelected && "textGradient"
                              )}
                            >
                              {("0" + item.text).slice(-2)}
                            </span>
                          </Datepicker.Item>
                        ))
                      }
                    </Datepicker.Items>
                    <Datepicker.Items
                      type="minute"
                      className="overflow-y-auto scroll-smooth px-2 flg:px-4"
                      disableAutoScroll
                    >
                      {({ items }) =>
                        items.map((item) => (
                          <Datepicker.Item
                            key={item.key}
                            item={item}
                            action="close"
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium hover:bg-gray-700 hover:text-white fsm:text-sm",
                              item.isSelected &&
                                "gradient-border-5 bg-transparent p-[1px]"
                            )}
                          >
                            <span
                              className={clsx(
                                item.isSelected && "textGradient"
                              )}
                            >
                              {("0" + item.text).slice(-2)}
                            </span>
                          </Datepicker.Item>
                        ))
                      }
                    </Datepicker.Items>
                  </div>
                </Datepicker.Picker>
              </>
            )}
          </Datepicker.Picker>
        </Datepicker>
      </div>
    </div>
  );
};

const gradientBorderInputParent =
  "focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px] relative";
const gradientBorderInput =
  "relative block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0";
const gradientBorderInputMain =
  "col-span-full mb-6 text-sm font-medium text-white fmd:mb-0 fmd:col-span-1";
const label = "block font-normal tracking-wide";
const labelSpan = "text-gradient ml-[2px]";
