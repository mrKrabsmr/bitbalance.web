import { useUserStore } from "@/stores/user.store";
import api, { type ErrorResponse, type SuccessResponse } from ".";


export async function cryptocurrencies(): Promise<SuccessResponse | ErrorResponse> {
     return await api.get("cryptocurrencies", {}).json()
}
