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

    // QA-fix: membership may be absent on embedded user objects
    // (e.g. reply parent_post.user) — never throw on it.
    const status = params.user.membership?.status;
    if (status === "verified") {
      setVerificationIcon("/images/verified-icon.png");
    } else if (status === "citizen") {
      setVerificationIcon("/images/citizen-icon.svg");
    } else {
      setVerificationIcon(null);
    }
  }, [params.user, params.shouldAnimate]);

  return verificationIcon;
};
