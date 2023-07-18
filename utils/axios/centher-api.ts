import axios from "axios";
import { getBackendUrl } from "@/constants/common";
import {
  registerAuthTokenRequestInterceptor,
  registerAuthTokenResponseInterceptor,
} from "./auth-tokens-interceptors";

export const axiosApiCenther = axios.create({
  baseURL: getBackendUrl("http", "frontend-to-backend"),
});

registerAuthTokenRequestInterceptor(axiosApiCenther);
registerAuthTokenResponseInterceptor(axiosApiCenther);
