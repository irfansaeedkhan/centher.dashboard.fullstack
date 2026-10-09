import axios from "axios";
import { CAPIBaseURL } from "@/constants/base-urls";
import {
  registerAuthTokenRequestInterceptor,
  registerAuthTokenResponseInterceptor,
} from "./auth-tokens-interceptors";

export const axiosApi369x = axios.create({
  baseURL: CAPIBaseURL,
  withCredentials: true,
});

registerAuthTokenRequestInterceptor(axiosApi369x);
registerAuthTokenResponseInterceptor(axiosApi369x);
