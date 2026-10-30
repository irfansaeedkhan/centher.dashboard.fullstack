import axios from "axios";
import { CISBaseURL } from "@/constants/base-urls";
import {
  registerAuthTokenRequestInterceptor,
  registerAuthTokenResponseInterceptor,
} from "./auth-tokens-interceptors";

// CIS => Sociaket Identity Service
// TODO: Change CIS to IS
export const axiosCIS = axios.create({
  baseURL: CISBaseURL,
  withCredentials: true,
});

registerAuthTokenRequestInterceptor(axiosCIS);
registerAuthTokenResponseInterceptor(axiosCIS);
