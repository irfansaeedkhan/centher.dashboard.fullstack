import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { customLog } from "../custom.log";
import { submitEnquiryForm } from "./re-captcha-logic";

export const useRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const submitRecaptcha = useCallback(async (): Promise<boolean> => {
    if (!executeRecaptcha) {
      customLog(
        ["development", "staging"],
        "Execute recaptcha not yet available"
      );
      return false;
    }

    const gReCaptchaToken = await executeRecaptcha("enquiryFormSubmit");
    return submitEnquiryForm(gReCaptchaToken);
  }, [executeRecaptcha]);

  return { submitRecaptcha: submitRecaptcha };
};
