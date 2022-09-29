import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { NullOrUndefined } from "@/models/common";

import { getRegistrationFee } from "./get.registration.fee";

const useGetRegistrationFee = (referrer: string | NullOrUndefined) => {
  const [state, setState] = useState<{
    registrationFee: number | NullOrUndefined;
    error: any;
  }>({
    registrationFee: undefined,
    error: undefined,
  });
  const { library } = useWeb3React();

  useEffect(() => {
    if (library) {
      getRegistrationFee(library, referrer)
        .then((registrationFee) => {
          setState({
            registrationFee,
            error: null,
          });
        })
        .catch((error) => {
          setState({
            registrationFee: null,
            error,
          });
        });
    }
  }, [referrer, library]);

  return {
    registrationFee: state.registrationFee,
    isLoading: !state.error && !state.registrationFee,
    error: state.error,
  };
};

export default useGetRegistrationFee;
