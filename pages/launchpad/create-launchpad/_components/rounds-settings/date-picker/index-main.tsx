import React, { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { Button, Calendar, Section, SectionHeader } from "./";
import {
  getDayClassName,
  getMonthClassName,
  getYearsClassName,
} from "./classnames-utils";
import {
  useContextTime,
  useContextTimePropGetters,
  useDatePicker,
} from "@rehookify/datepicker";

const IndexMain = () => {
  const [selectedDates, onDatesChange] = useState<Date[]>([]);
  const [selectedSections, setSelectedSections] = useState<
    "dates" | "months" | "years"
  >("dates");
  // const { time } = useContextTime();
  // const { timeButton } = useContextTimePropGetters();
  const {
    data: { calendars, weekDays, formattedDates, months, years },
    propGetters: {
      dayButton,
      addOffset,
      subtractOffset,
      monthButton,
      nextYearsButton,
      previousYearsButton,
      yearButton,
    },
  } = useDatePicker({
    selectedDates,
    onDatesChange,
    calendar: {
      startDay: 1,
    },
  });

  const { month, year, days } = calendars[0];

  const onDayClick = (evt: React.MouseEvent<HTMLElement>, date: Date) => {
    // In case you need any action with evt
    evt.stopPropagation();

    // In case you need any additional action with date
    console.log(date);
  };

  return (
    <div className="shadow-xs absolute bottom-12 right-0 z-[100] block w-[368px] rounded-lg bg-black-shade-8 pb-6">
      {/* <h1 className="mb-6 w-full text-center text-2xl">
    {formattedDates[0]}
  </h1> */}
      <main className="w-full">
        {selectedSections === "dates" && (
          <Section>
            <SectionHeader>
              <div className="flex items-center gap-1">
                <Button
                  className="!h-6 !w-6"
                  {...subtractOffset({ months: 12 })}
                >
                  <FiChevronsLeft />
                </Button>
                <Button
                  className="!h-6 !w-6"
                  {...subtractOffset({ months: 1 })}
                >
                  <FiChevronLeft />
                </Button>
              </div>
              <p
                className="cursor-pointer text-center text-sm font-semibold text-white"
                onClick={() => setSelectedSections("months")}
              >
                {month} {year}
              </p>
              <div className="flex items-center gap-1">
                <Button className="!h-6 !w-6" {...addOffset({ months: 1 })}>
                  <FiChevronRight />
                </Button>
                <Button className="!h-6 !w-6" {...addOffset({ months: 12 })}>
                  <FiChevronsRight />
                </Button>
              </div>
            </SectionHeader>
            <div>
              <Calendar className="mb-2 h-8 items-center">
                {weekDays.map((d, i) => (
                  <p
                    className="text-center text-xs font-semibold text-white"
                    key={i}
                  >
                    {d}
                  </p>
                ))}
              </Calendar>
              <Calendar>
                {days.map((d) => (
                  <Button
                    key={d.$date.toString()}
                    className={getDayClassName("w-8 text-xs text-white", d)}
                    selectedSections={selectedSections}
                    {...dayButton(d, { onClick: onDayClick })}
                  >
                    {d.day}
                  </Button>
                ))}
              </Calendar>
            </div>
          </Section>
        )}
        {selectedSections === "months" && (
          <Section>
            <SectionHeader>
              <Button className="!h-6 !w-6" {...subtractOffset({ months: 12 })}>
                <FiChevronLeft />
              </Button>
              <p
                className="cursor-pointer text-center text-sm font-semibold text-white"
                onClick={() => setSelectedSections("years")}
              >
                {year}
              </p>
              <Button className="!h-6 !w-6" {...addOffset({ months: 12 })}>
                <FiChevronRight />
              </Button>
            </SectionHeader>
            <main className="grid grid-cols-3 items-center gap-x-2 gap-y-2">
              {months.map((m) => (
                <Button
                  key={m.month + year}
                  className={getMonthClassName("text-xs text-white", m)}
                  selectedSections={selectedSections}
                  {...monthButton(m)}
                >
                  {m.month}
                </Button>
              ))}
            </main>
          </Section>
        )}
        {selectedSections === "years" && (
          <Section>
            <SectionHeader>
              <Button className="!h-6 !w-6" {...previousYearsButton()}>
                <FiChevronLeft />
              </Button>
              <p className="text-center text-sm text-white">
                {`${years[0].year} - ${years[years.length - 1].year}`}
              </p>
              <Button className="!h-6 !w-6" {...nextYearsButton()}>
                <FiChevronRight />
              </Button>
            </SectionHeader>
            <main className="grid grid-cols-3 items-center gap-x-2 gap-y-2 px-4">
              {years.map((y) => (
                <Button
                  key={y.$date.toString()}
                  className={getYearsClassName("text-xs", y)}
                  selectedSections={selectedSections}
                  {...yearButton(y)}
                >
                  {y.year}
                </Button>
              ))}
            </main>
          </Section>
        )}
      </main>
    </div>
  );
};

export default IndexMain;
