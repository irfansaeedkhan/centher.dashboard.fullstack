import { useEffect, useState } from "react";

interface Params {
  user?: { is_verified: boolean } | null;
  shouldAnimate?: boolean;
}

export const useVerificationTick = (
  params: Params = {
    user: null,
    shouldAnimate: false,
  }
) => {
  const [verificationIcon, setVerificationIcon] = useState<null | string>(null);

  useEffect(() => {
    if (!params.user) {
      setVerificationIcon(null);
      return;
    }

    if (!params.shouldAnimate) {
      setVerificationIcon(
        params.user.is_verified ? "/images/rainbow-last-frame.png" : null
      );
      return;
    }

    if (params.user.is_verified) {
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
  }, [params.user, params.shouldAnimate]);

  return verificationIcon;
};
