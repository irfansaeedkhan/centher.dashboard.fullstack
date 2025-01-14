import React from "react";
import clsx from "clsx";

interface Props {
  currentLength: number;
  maxLength: number;
  strokeWidth?: number;
  className?: string;
}

export const TextLengthChecker: React.FC<Props> = ({
  currentLength,
  maxLength,
  strokeWidth = 8,
  className,
}) => {
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;
  const radius = center - strokeWidth;
  const arcLength = 2 * Math.PI * radius;

  const dashArray = arcLength;
  let dashOffset = dashArray * ((maxLength - currentLength) / maxLength);
  const thresholdReached = currentLength > maxLength;

  if (thresholdReached) {
    dashOffset = 0;
  }

  return (
    <div className={clsx(`relative`, className)}>
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className={clsx(`-rotate-90 transform`)}
      >
        <circle
          r={radius}
          cx={center}
          cy={center}
          fill="none"
          strokeWidth={strokeWidth}
          className={clsx(`stroke-gray-shade-3`)}
        />
        <circle
          r={radius}
          cx={center}
          cy={center}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          className={clsx({
            "stroke-red-500": thresholdReached,
            "stroke-white": !thresholdReached,
          })}
        />
      </svg>
    </div>
  );
};
