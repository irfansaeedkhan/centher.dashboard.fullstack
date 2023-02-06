import { useEffect, useState } from "react";

export const useVerificationTick = (user?: { is_verified: boolean }) => {
  const [verificationIcon, setVerificationIcon] = useState<null | string>(null);

  useEffect(() => {
    if (!user) {
      setVerificationIcon(null);
      return;
    }

    if (user.is_verified) {
      const timeout1 = setTimeout(function () {
        setVerificationIcon("/images/rainbow-1.gif");
      }, 3000);
      const timeout2 = setTimeout(function () {
        setVerificationIcon("/images/rainbow-2.gif");
      }, 4600);
      const interval1 = setInterval(() => {
        setVerificationIcon("/images/rainbow-last-frame.png");
      }, 9200);
      const interval2 = setInterval(() => {
        setVerificationIcon("/images/rainbow-2.gif");
      }, 20000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearInterval(interval1);
        clearInterval(interval2);
      };
    } else {
      setVerificationIcon(null);
    }
  }, [user]);
  return verificationIcon;
};
