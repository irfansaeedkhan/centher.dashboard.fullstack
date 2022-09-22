import axios from "axios";
import { NODE_API_URL } from "@/constants/common";

export const axiosNodeApi = axios.create({
  baseURL: NODE_API_URL,
  withCredentials: true,
});
