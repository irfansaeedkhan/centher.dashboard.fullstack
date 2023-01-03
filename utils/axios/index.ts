import axios from "axios";

import { NODE_API_URL } from "@/constants/common";

import { encryptReqPayload } from "./encrypt.request.payload";

export const axiosNodeApi = axios.create({
  baseURL: NODE_API_URL,
  withCredentials: true,
});

axiosNodeApi.interceptors.request.use(function (config) {
  // Encrypt the Data
  config.data = { payload: encryptReqPayload(config.data) };
  return config;
});
