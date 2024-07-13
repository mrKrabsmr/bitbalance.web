import { defineStore } from "pinia";
import cookies from "../services/cookies.service";
import { login, refresh, register } from "../services/user.service";
import type { LoginDTO, RegisterDTO } from "@/services/dto/user.dto";

export interface IUser {
    user: {
        isBoss: boolean;
        username: string,
    }
}

export const useUserStore = defineStore("user", {
    state: (): IUser => ({
        user: {
            isBoss: false,
            username: "",
        }
    }),
    actions: {
        async fetchUser(): Promise<boolean> {
            const accessToken = cookies.get("access")

            if (!accessToken) {
                const refreshToken = cookies.get("refresh")

                if (!refreshToken) {
                    return false
                }

                const response = await refresh({"refresh_token": refreshToken})
                if (response.error) {
                    return false
                }
                
                cookies.set("access", response.data.access_token, {"expires": "15min"})
                cookies.set("refresh", response.data.refresh_token, {"expires": "30d"})
                cookies.set("username", response.data.username)
                
                this.user = {
                    isBoss: false,
                    username: response.data.username
                }

                return true
            }

            return true
        },
        async login(form: LoginDTO): Promise<string> {
            try {
                const response = await login(form)

                this.user = {
                    isBoss: false,
                    username: response.data.username
                }
            
                cookies.set("access", response.data.access_token, {"expires": "15min"})
                cookies.set("refresh", response.data.refresh_token, {"expires": "30d"})
                cookies.set("username", response.data.username)
                
                return ""
            } catch (error) {
                return "неверные данные для входа"
            }
        },
        async register(form: RegisterDTO): Promise<string> {
            try {
                const response = await register(form)

                this.user = {
                    isBoss: false,
                    username: response.data.username
                }

                cookies.set("access", response.data.access_token, {"expires": "15min"})
                cookies.set("refresh", response.data.refresh_token, {"expires": "30d"})
                cookies.set("username", response.data.username)

                return ""
            } catch (error) {
                alert(error.response.status)
                return "пользователь с таким именем пользователя уже существует"
            }
        }
    }
})