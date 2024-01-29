import Button from "@/components/button";
import { useRouter } from "next/router";
import React, { useState } from "react";

const ReloadRequiredModalContent: React.FC<{
  type: string;
  close: (mode: string) => void;
}> = ({ type, close }) => {
  const [time, setTime] = useState(5000);
  const timeOut = setTimeout(() => {
    if (time > 0) {
      const t = time - 1000;
      setTime(t);
    }

    if (time == 1000) {
      reloadNow();
    }
  }, 5000);

  const reloadNow = () => {
    clearTimeout(timeOut);
    close("now");
  };

  const reloadLater = () => {
    clearTimeout(timeOut);
    close("later");
  };

  return (
    <div className={modalBodyWrapper1}>
      <p className="text-center text-sm font-normal leading-6 text-gray-shade-2">
        {type == "reward"
          ? `There are new rewards available to claim or restake, please reload the page to see the current status of your rewards. The page will automatically reload in ${
              time / 1000
            } seconds.`
          : `Your staking has expired! Please reload the page to see the current status of your stake and unstake. The page will automatically reload in ${
              time / 1000
            } seconds.`}
      </p>
      <div className="flex flex-shrink-0 items-center gap-2">
        <Button
          className="text-sm"
          title="Reload Now"
          borderRounded="10px"
          onClick={reloadNow}
        />

        <Button
          className="text-sm"
          title="Reload Later"
          borderRounded="10px"
          onClick={reloadLater}
        />
      </div>
    </div>
  );
};

export default ReloadRequiredModalContent;
const modalBodyWrapper1 = `flex flex-col gap-4 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 items-center`;
