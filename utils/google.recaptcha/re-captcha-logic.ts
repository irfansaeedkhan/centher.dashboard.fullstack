import axios from "axios";

export const submitEnquiryForm = (
  gReCaptchaToken: string
): Promise<boolean> => {
  return axios
    .post<boolean>(
      `${process.env.NEXT_PUBLIC_RECAPTCHA_SERVICE_API_HOST}/api/recaptcha`,
      {
        token: gReCaptchaToken,
      },
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.data)
    .then(() => {
      return true; // Return true if the backend response indicates success
    })
    .catch(() => {
      return false; // Return false if an error occurred during the request
    });
};
