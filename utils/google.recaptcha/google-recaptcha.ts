import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const useRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const submitRecaptcha = useCallback(async (): Promise<boolean> => {
    const submitEnquiryForm = (gReCaptchaToken: any): Promise<boolean> => {
      return fetch("http://localhost:5002/api/recaptcha", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: gReCaptchaToken,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          return true; // Return true if the backend response indicates success
        })
        .catch(() => {
          return false; // Return false if an error occurred during the request
        });
    };

    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return false;
    }

    const gReCaptchaToken = await executeRecaptcha("enquiryFormSubmit");
    console.log(gReCaptchaToken);
    return submitEnquiryForm(gReCaptchaToken);
  }, [executeRecaptcha]);

  return { submitRecaptcha: submitRecaptcha };
};
