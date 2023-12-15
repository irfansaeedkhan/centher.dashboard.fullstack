import React from "react";
import clsx from "clsx";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard9Mobile: React.FC<Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        `relative flex h-[330px] w-full max-w-[272px] rounded-10px border border-gray-shade-3`,
        className
      )}
      {...props}
    >
      <video autoPlay muted loop className="rounded-10px">
        <source src="/images/apex-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
