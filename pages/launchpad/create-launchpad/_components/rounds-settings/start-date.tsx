import React from "react";
import { Datepicker } from "@aliakbarazizi/headless-datepicker";
import cn from "@/utils/cn";
import clsx from "clsx";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from "@/components/button";

const StartDate = () => {
  const [value, setValue] = React.useState();

  return (
    <div>
      <Datepicker onChange={setValue} value={value}>
        <Datepicker.Input
          format="yyyy/MM/dd HH:mm"
          className="relative block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
        />
        <Datepicker.Picker
          defaultType="day"
          className="w-[368px] rounded-bl-lg rounded-tl-lg border border-gray-shade-3 !bg-black-shade-8 pb-4 !will-change-auto"
        >
          {({ monthName, hour, minute, year }) => (
            <>
              <div className="flex h-14 w-full items-center justify-between space-x-6 border-b border-gray-shade-3 px-4 pb-2 pt-4 rtl:space-x-reverse">
                <Datepicker.Button
                  action="prev"
                  className="rounded-full p-2 text-sm font-medium hover:bg-gray-700 hover:text-white rtl:rotate-180"
                >
                  <FiChevronLeft />
                </Datepicker.Button>
                <div className="flex gap-3">
                  <Datepicker.Button
                    action="toggleHourPicker"
                    className="leading-2 flex items-center space-x-2 text-sm font-semibold text-white"
                  >
                    {("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2)}
                  </Datepicker.Button>
                  <Datepicker.Button
                    action="toggleMonth"
                    className="leading-2 text-sm font-semibold text-white"
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
                  className="rounded-full p-2 text-sm font-medium hover:bg-gray-700 hover:text-white rtl:rotate-180"
                >
                  <FiChevronRight />
                </Datepicker.Button>
              </div>
              <Datepicker.Items
                className={({ type }) =>
                  cn(
                    "grid w-full auto-rows-max gap-4 overflow-y-auto scroll-smooth px-4 pt-3",
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
                        "grid select-none items-center justify-center rounded-full py-1.5 text-sm font-medium",
                        item.isHeader ? "cursor-default" : "hover:bg-gray-700",
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
                      <span className={clsx(item.isSelected && "textGradient")}>
                        {item.isHeader ? item.text.substring(0, 2) : item.text}
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
                className="absolute right-[-131px] top-0 z-50 flex max-h-full w-[130px] transform-none flex-col space-y-2 rounded-br-lg rounded-tr-lg border border-l-0 border-gray-shade-3 !bg-black-shade-8 pb-2 !will-change-auto"
                id="HourPicker"
                attachTo={true}
              >
                <div className="mx-auto flex min-h-[56px] w-full items-center justify-center border-b border-gray-shade-3 text-lg font-semibold">
                  <span className="textGradient w-fit">Time</span>
                </div>
                <div className="flex max-h-full overflow-y-auto">
                  <Datepicker.Items
                    type="hour"
                    className="overflow-y-auto scroll-smooth px-4"
                    disableAutoScroll
                  >
                    {({ items }) =>
                      items.map((item) => (
                        <Datepicker.Item
                          key={item.key}
                          item={item}
                          action="close"
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium hover:bg-gray-700 hover:text-white",
                            item.isSelected &&
                              "gradient-border-5 bg-transparent p-[1px]"
                          )}
                        >
                          <span
                            className={clsx(item.isSelected && "textGradient")}
                          >
                            {("0" + item.text).slice(-2)}
                          </span>
                        </Datepicker.Item>
                      ))
                    }
                  </Datepicker.Items>
                  <Datepicker.Items
                    type="minute"
                    className="overflow-y-auto scroll-smooth px-4"
                    disableAutoScroll
                  >
                    {({ items }) =>
                      items.map((item) => (
                        <Datepicker.Item
                          key={item.key}
                          item={item}
                          action="close"
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium hover:bg-gray-700 hover:text-white",
                            item.isSelected &&
                              "gradient-border-5 bg-transparent p-[1px]"
                          )}
                        >
                          <span
                            className={clsx(item.isSelected && "textGradient")}
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
  );
};

export default StartDate;
