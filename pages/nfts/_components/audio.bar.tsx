import clsx from "clsx";
import React from "react";

interface BarProps {
  duration: number;
  curTime: number;
  onTimeUpdate: (time: number) => void;
}

const Bar: React.FC<BarProps> = (props) => {
  const { duration, curTime, onTimeUpdate } = props;

  const curPercentage = (curTime / duration) * 100;

  function calcClickedTime(e: React.MouseEvent) {
    const clickPositionInPage = e.pageX;
    const bar = document.querySelector(".bar__progress") as HTMLElement | null;
    let barStart = 0;
    let barWidth = 0;
    if (bar) {
      barStart = bar.getBoundingClientRect().left + window.scrollX;
      barWidth = bar.offsetWidth;
    }

    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = duration / barWidth;
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e: React.MouseEvent) {
    onTimeUpdate(calcClickedTime(e));

    const updateTimeOnMove = (eMove: any) => {
      onTimeUpdate(calcClickedTime(eMove));
    };

    document.addEventListener("mousemove", updateTimeOnMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTimeOnMove);
    });
  }

  return (
    <div className="w-full flex items-center select-none">
      <div
        className="h-14 flex-1 rounded-xl flex items-center cursor-pointer"
        style={{
          background: `linear-gradient(to right, #2a2d3c ${curPercentage}%, #1F212B 0)`,
        }}
        onMouseDown={(e) => handleTimeDrag(e)}
      >
        <span
          className={clsx(
            `relative w-[2px] bg-white h-[54px]`,
            `left-[${curPercentage - 2}%]`
          )}
        />
      </div>
    </div>
  );
};

export default Bar;
