import React, { createContext } from "react";

interface HostRequestContextInterface {
  requests: Array<any>;
  setRequest: React.Dispatch<React.SetStateAction<any>>;
}

const defaultValue: HostRequestContextInterface = {
  requests: [],
  setRequest: () => {
    throw new Error("setRequest is not implemented");
  },
};

export const HostRequestContext =
  createContext<HostRequestContextInterface>(defaultValue);
