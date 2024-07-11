<script setup lang="ts">
    import { useRouter } from "vue-router";
    import LoginForm from "../components/LoginForm.vue";
    import { type LoginDTO, type RegisterDTO } from "../services/dto/user.dto.ts"
    import { useUserStore } from "@/stores/user.store";

    const store = useUserStore();
    const router = useRouter();

    const usersLogin = async (form: LoginDTO) => {
        const response = await store.login(form);

        if (response) {
            await router.push("/")
            window.location.href = "/"
        } else {
            alert("Неверные учетные данные")
        }
    }

    const usersRegister = async (form: RegisterDTO) => {
        const response = await store.register(form);

        if (response) {
            await router.push("/")
            window.location.href = "/"
        } else {
            alert("Пользователь с таким username уже существует")
        }
    }

</script>

<template>
    <login-form @loginSubmit="usersLogin" @registerSubmit="usersRegister"></login-form>
</template>

<style scoped></style>
