import { useEffect, useState } from "react";
import { User } from "@/models/user";

interface Params {
  user?: { membership: User["membership"] } | null;
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

    if (params.user.membership.status === "verified") {
      setVerificationIcon("/images/verified-icon.svg");
    } else if (params.user.membership.status === "citizen") {
      setVerificationIcon("/images/citizen-icon.svg");
    } else {
      setVerificationIcon(null);
    }
  }, [params.user, params.shouldAnimate]);

  return verificationIcon;
};
