import axios, { AxiosError, AxiosResponse } from "axios";
import { getBaseUrl } from "../config/envConfig";
import { getFromLocalStorage } from "@/utils/local-storage";

export async function axiosRequest(
  url: string,
  method: string = "GET",
  data?: any,
  contentType: string = "application/json"
) {
  try {
    let headers = {
      "Content-Type": contentType,
    } as any;

    const Authorization = getFromLocalStorage("accessToken");

    if (Authorization) {
      headers["Authorization"] = `${Authorization}`;
    }

    const baseUrl = getBaseUrl();

    const response: AxiosResponse = await axios({
      url: baseUrl + url,
      method,
      data,
      headers,
    });

    return {
      data: response?.data,
      meta: response?.data?.meta || {},
    };
  } catch (error) {
    let err = error as AxiosError;
    return {
      error: {
        status: err.response?.status || err.status || 500,
        message: err.response?.data || err.message || "Something went wrong",
      },
    };
  }
}
