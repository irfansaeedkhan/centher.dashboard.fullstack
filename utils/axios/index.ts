import axios from "axios";

import { NODE_API_URL } from "@/constants/common";

import { encryptReqPayload } from "./encrypt.request.payload";

export const axiosNodeApi = axios.create({
  baseURL: NODE_API_URL,
  withCredentials: true,
});

// 💥 Match this list of urls with the list of urls on the server
const skipEncryption = [
  "/api/socials/posts-media/upload",
  "/api/socials/profile/upload",
];

axiosNodeApi.interceptors.request.use(function (config) {
  // Encrypt the Data
  if (config.url && !skipEncryption.includes(config.url)) {
    config.data = { payload: encryptReqPayload(config.data) };
  }
  return config;
});
