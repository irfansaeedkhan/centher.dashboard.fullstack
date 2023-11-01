import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { ModalPortal } from "@/components/modal/modal.portal";
import Button from "@/components/button";
import useUser from "@/hooks/use.user";
import { updateCookiesConsent } from "@/lib/cookies-consent";
import { CookiesIcon } from "@/assets/svgs";

export const CookiesConstentModal: React.FC = () => {
  const { user } = useUser();
  const [showCookiesBanner, setShowCookiesBanner] = useState(false);

  const updateGTMConsent = useCallback(
    (consentStatus: "granted" | "denied") => {
      window.gtag("consent", "update", {
        ad_storage: consentStatus,
        analytics_storage: consentStatus,
        personalization_storage: consentStatus,
        functionality_storage: consentStatus,
        security_storage: consentStatus,
      });
    },
    []
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!user.cookies_consent) {
      setShowCookiesBanner(true);
      return;
    }

    // If difference is greater than 14 days and consent was not given
    if (user.cookies_consent.consent_given === false) {
      const lastConsentDate = moment(user.cookies_consent.timestamp); // Last consent date
      const differenceInDays = moment().diff(lastConsentDate, "days"); // Difference in days
      const has14DaysPassed = differenceInDays > 14;

      if (has14DaysPassed) {
        setShowCookiesBanner(true);
      }
    }
  }, [user, updateGTMConsent]);

  const handleCookiesConsent = async (consentStatus: boolean) => {
    if (consentStatus) {
      updateGTMConsent("granted");
    } else {
      updateGTMConsent("denied");
    }

    try {
      await updateCookiesConsent(consentStatus);
    } catch {}

    setShowCookiesBanner(false);
  };

  if (user) {
    if (user.cookies_consent && user.cookies_consent.consent_given) {
      updateGTMConsent("granted");
    } else {
      updateGTMConsent("denied");
    }
  }

  if (!showCookiesBanner) return null;

  return (
    <ModalPortal wrapperId="post-modal-portal">
      {/* Background */}
      <div
        className={`fixed inset-0 bottom-0 z-[1050] flex items-end justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-10 font-monto backdrop-blur-md`}
      >
        {/* Container */}
        <div
          className={`flex h-auto max-h-[90%] w-full max-w-[640px] flex-col rounded-t-2xl border border-gray-shade-3 border-opacity-40 bg-black-shade-12 p-5 fsm:mx-2 fsm:mb-2 fsm:rounded-2xl fmd:mx-0 fmd:mb-4`}
        >
          {/* Children Wrapper */}
          <div className="scrollSet flex flex-col items-center gap-3 overflow-auto fsm:flex-row">
            <div className="flex flex-col items-center gap-4 fsm:flex-row">
              <CookiesIcon className="h-11 w-11 shrink-0 fmd:h-12 fmd:w-12" />
              <p className="text-center text-sm font-normal text-white fsm:text-left">
                We use third-party cookies in order to personalize your site
                experience.
              </p>
            </div>
            <div className="flex w-full flex-col-reverse items-center gap-3 p-3 fsm:w-auto fsm:flex-row">
              <Button
                title="Decline"
                variant="secondary"
                className="w-full rounded-[14px] text-sm fsm:w-auto"
                onClick={() => {
                  handleCookiesConsent(false);
                }}
              />
              <Button
                title="Allow"
                variant="primary"
                className="w-full rounded-[14px] text-sm fsm:w-auto"
                onClick={() => {
                  handleCookiesConsent(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
