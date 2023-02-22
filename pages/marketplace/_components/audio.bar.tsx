import clsx from "clsx";
import React from "react";

interface BarProps {
  duration: number;
  curTime: number;
  onTimeUpdate: (time: number) => void;
}

const Bar: React.FC<BarProps> = (props) => {
  const { duration, curTime, onTimeUpdate } = props;

  const curPercentage: number = (curTime / duration) * 100;

  function calcClickedTime(e: React.MouseEvent) {
    const clickPositionInPage = e.pageX;
    const bar = document.querySelector(".bar__progress") as HTMLElement;
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.offsetWidth;
    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = duration / barWidth;
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e: React.MouseEvent) {
    onTimeUpdate(calcClickedTime(e));

    const updateTimeOnMove = () => {
      onTimeUpdate(calcClickedTime(e));
    };

    document.addEventListener("mousemove", updateTimeOnMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTimeOnMove);
    });
  }

  return (
    <div className="flex w-full select-none items-center">
      <div
        className="bar__progress flex h-14 flex-1 cursor-pointer items-center rounded-xl"
        style={{
          background: `linear-gradient(to right, #2a2d3c ${curPercentage}%, #1F212B 0)`,
        }}
        onMouseDown={handleTimeDrag}
      >
        <span
          className={clsx(`relative h-[54px] w-[2px] bg-white`)}
          style={{
            left: `${curPercentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Bar;
