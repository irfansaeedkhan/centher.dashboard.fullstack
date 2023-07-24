import axios from "axios";
import { CISBaseURL } from "@/constants/base-urls";
import {
  registerAuthTokenRequestInterceptor,
  registerAuthTokenResponseInterceptor,
} from "./auth-tokens-interceptors";

// CIS => Centher Identity Service
export const axiosCIS = axios.create({
  baseURL: CISBaseURL,
});

registerAuthTokenRequestInterceptor(axiosCIS);
registerAuthTokenResponseInterceptor(axiosCIS);
