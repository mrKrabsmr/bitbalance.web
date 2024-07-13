<script setup lang="ts">
    import { useRouter } from "vue-router";
    import LoginForm from "../components/LoginForm.vue";
    import { type LoginDTO, type RegisterDTO } from "../services/dto/user.dto.ts"
    import { useUserStore } from "@/stores/user.store";
    import { ref } from "vue";

    const store = useUserStore();
    const router = useRouter();

    const errorLogin = ref("")
    const errorRegister = ref("")

    const usersLogin = async (form: LoginDTO) => {
        const error = await store.login(form);
        if (error != "") {
            errorLogin.value = error
            return
        }

        await router.push("/")
        window.location.href = "/"
    }

    const usersRegister = async (form: RegisterDTO) => {
        const error = await store.register(form);
        if (error != "") {
            errorRegister.value = error
            return
        }

        await router.push("/")
        window.location.href = "/"
    }

</script>

<template>
    <login-form @loginSubmit="usersLogin" @registerSubmit="usersRegister" :errorLogin="errorLogin" :errorRegister="errorRegister"></login-form>
</template>

<style scoped></style>
