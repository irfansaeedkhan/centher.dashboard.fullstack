import React from "react";
import cn from "@/utils/cn";

interface Props {
  currentLength: number;
  maxLength: number;
  strokeWidth?: number;
  className?: string;
  counterClassName?: string;
}

export const PostTextCounter: React.FC<Props> = ({
  currentLength,
  maxLength,
  strokeWidth = 8,
  className,
  counterClassName,
}) => {
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;
  const radius = center - strokeWidth;
  const arcLength = 2 * Math.PI * radius;

  const dashArray = arcLength;
  let dashOffset = dashArray * ((maxLength - currentLength) / maxLength);
  const thresholdReached = currentLength > maxLength;

  if (thresholdReached) {
    // Set to 0 to stop the animation
    dashOffset = 0;
  }

  return (
    <div className={cn(`relative`, className)}>
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          {
            "text-red-500": thresholdReached,
            textGradient: !thresholdReached,
          },
          counterClassName ? counterClassName : "text-[9px] font-semibold"
        )}
      >
        {!!currentLength && currentLength}
      </div>

      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className={cn(`-rotate-90`)}
      >
        <circle
          r={radius}
          cx={center}
          cy={center}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn(`stroke-gray-shade-3`)}
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
          className={cn({
            "stroke-red-500": thresholdReached,
            "stroke-brand-primary": !thresholdReached,
          })}
        />
      </svg>
    </div>
  );
};
