import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { submitEnquiryForm } from "./re-captcha-logic";

export const useRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const submitRecaptcha = useCallback(async (): Promise<boolean> => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return false;
    }

    const gReCaptchaToken = await executeRecaptcha("enquiryFormSubmit");
    console.log("gReCaptchaToken", gReCaptchaToken);
    return submitEnquiryForm(gReCaptchaToken);
  }, [executeRecaptcha]);

  return { submitRecaptcha };
};
