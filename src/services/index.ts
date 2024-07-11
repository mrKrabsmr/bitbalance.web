import ky from "ky";

export const prefixAPI = import.meta.env.VITE_API_URL

const api = ky.extend(
    {
       prefixUrl: prefixAPI,
       timeout: 30000,
    }
);

export default api;

export interface ErrorResponse {
    error: boolean,
    message: string,
}

export interface SuccessResponse {
    error: boolean,
    data: any,
}
