import type { ErrorResponse, SuccessResponse } from ".";
import api from ".";
import cookies from "./cookies.service";

export async function getPortfolio(): Promise<SuccessResponse | ErrorResponse> {
     return await api.get("portfolio", {
          headers: {
               "Content-type": "application/json",
               "Authorization": "Bearer " + cookies.get("access")
          }
     }).json()
}

export async function createPortfolio(dto: object): Promise<SuccessResponse | ErrorResponse> {
     return await api.post("portfolio", {
          json: dto,
          headers: {
               "Content-type": "application/json",
               "Authorization": "Bearer " + cookies.get("access")
          }
     }).json()
}

export async function updatePortfolio(dto: object, id: string): Promise<SuccessResponse | ErrorResponse> {
     return await api.patch("portfolio/" + id, {
          json: dto,
          headers: {
               "Content-type": "application/json",
               "Authorization": "Bearer " + cookies.get("access")
          }
     }).json()
}

export async function deletePortfolio(id: string): Promise<SuccessResponse | ErrorResponse> {
     return await api.delete("portfolio/" + id, {
          headers: {
               "Content-type": "application/json",
               "Authorization": "Bearer " + cookies.get("access")
          }
     }).json()
}


