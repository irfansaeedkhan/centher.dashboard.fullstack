import axios from "axios";
import { CFSBaseURL } from "@/constants/base-urls";
import {
  registerAuthTokenRequestInterceptor,
  registerAuthTokenResponseInterceptor,
} from "./auth-tokens-interceptors";

// CFS => Centher File Service
export const axiosCFS = axios.create({
  baseURL: CFSBaseURL,
});

registerAuthTokenRequestInterceptor(axiosCFS);
registerAuthTokenResponseInterceptor(axiosCFS);
