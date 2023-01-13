import axios from "axios";

import { getBackendUrl } from "@/constants/common";

import { encryptReqPayload } from "./encrypt.request.payload";

export const axiosNodeApi = axios.create({
  baseURL: getBackendUrl("http", "frontend-to-backend"),
  withCredentials: true,
});

axiosNodeApi.interceptors.request.use(function (config) {
  // Encrypt the Data
  config.data = { payload: encryptReqPayload(config.data) };
  return config;
});
