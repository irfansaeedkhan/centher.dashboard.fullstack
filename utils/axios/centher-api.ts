import axios from "axios";
import { CAPIBaseURL } from "@/constants/base-urls";
import {
  registerAuthTokenRequestInterceptor,
  registerAuthTokenResponseInterceptor,
} from "./auth-tokens-interceptors";

export const axiosApiCenther = axios.create({
  baseURL: CAPIBaseURL,
});

registerAuthTokenRequestInterceptor(axiosApiCenther);
registerAuthTokenResponseInterceptor(axiosApiCenther);
