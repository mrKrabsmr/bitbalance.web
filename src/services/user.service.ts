import api from "../services/index"
import {type ErrorResponse} from "../services/index";
import {type SuccessResponse} from "../services/index";


export async function login(dto: object): Promise<ErrorResponse | SuccessResponse> {
    return await api.post("login", {
        json: dto,
        headers: {
            "Content-Type": "application/json",
        }
    }).json()
}

export async function register(dto: object): Promise<ErrorResponse | SuccessResponse> {
    return await api.post("register", {
        json: dto,
        headers: {
            "Content-Type": "application/json"
        }
    }).json()
}

export async function refresh(dto: object): Promise<ErrorResponse | SuccessResponse> {
    return await api.post("refresh", {
        json: dto,
    }).json()
}
