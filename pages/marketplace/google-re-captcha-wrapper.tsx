import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface GoogleReCaptchaWrapperProps {
  reCaptchaKey: string;
  children: React.ReactNode;
}

const GoogleReCaptchaWrapper: React.FC<GoogleReCaptchaWrapperProps> = ({
  reCaptchaKey,
  children,
}) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={reCaptchaKey}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default GoogleReCaptchaWrapper;
