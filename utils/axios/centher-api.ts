import axios from "axios";
import { CAPIBaseURL } from "@/constants/base-urls";
import {
  registerAuthTokenRequestInterceptor,
  registerAuthTokenResponseInterceptor,
} from "./auth-tokens-interceptors";

export const axiosApi369x = axios.create({
  baseURL: CAPIBaseURL,
});

registerAuthTokenRequestInterceptor(axiosApi369x);
registerAuthTokenResponseInterceptor(axiosApi369x);
