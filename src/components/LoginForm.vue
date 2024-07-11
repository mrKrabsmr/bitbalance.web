<script setup lang="ts">
    import { ref, computed, onBeforeMount } from "vue"
    import { type LoginDTO, type RegisterDTO } from "@/services/dto/user.dto"
    import { useRoute } from "vue-router";

    const route = useRoute()

    const hiddenLoginForm = ref(true)
    const hiddenRegisterForm = ref(true)

    const emits = defineEmits({
        loginSubmit: (form: LoginDTO) => form,
        registerSubmit: (form: RegisterDTO) => form,
    })

    const loginSubmit = () => {
        emits("loginSubmit", loginForm.value)
    }

    const registerSubmit = () => {
        emits("registerSubmit", registerForm.value)
    }

    const loginForm = ref<LoginDTO>(
        {
            username: "",
            password: ""
        }
    )

    const registerForm = ref<RegisterDTO>(
        {
            username: "",
            password: "",
            confirm_password: "",
        }
    )

    const disabledLoginSubmit = computed(() => {
        return loginForm.value.username === "" || loginForm.value.password === ""
    })

    const disabledRegisterSubmit = computed(() => {
        return (
            registerForm.value.username === "" || registerForm.value.password === "" || registerForm.value.confirm_password === ""
        ) || (registerForm.value.password != registerForm.value.confirm_password)

    })

    onBeforeMount(() => {
        if (route.query.showLoginForm) {
            hiddenLoginForm.value = false
        }

        if (route.query.showRegisterForm) {
            hiddenRegisterForm.value = false
        }
    })
</script>

<template>
    <div class="auth__container">
        <div class="form__title cursor-pointer" :class="{ 'animate-pulse': hiddenLoginForm && hiddenRegisterForm }"
            @click="hiddenLoginForm = !hiddenLoginForm; hiddenRegisterForm = true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-8">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
            </svg>

            <span>Вход</span>
        </div>
        <div class="form" :hidden="hiddenLoginForm">
            <div class="form__item">
                <div class="label">Имя пользователя</div>
                <input v-model="loginForm.username" type="string" placeholder="Введите username" class="input__value">
            </div>

            <div class="form__item">
                <div class="label">Пароль</div>
                <input v-model="loginForm.password" type="password" placeholder="Введите пароль" class="input__value">
            </div>
            <div class="form__item">
                <button class="form__button" :disabled="disabledLoginSubmit"
                    :class="{ 'cursor-not-allowed': disabledLoginSubmit }" @click="loginSubmit">
                    Подтвердить
                </button>
            </div>
        </div>
        <div class="form__title cursor-pointer" :class="{ 'animate-pulse': hiddenRegisterForm && hiddenLoginForm }"
            @click="hiddenRegisterForm = !hiddenRegisterForm; hiddenLoginForm = true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-8">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
            </svg>

            <span>Регистрация</span>
        </div>
        <div class="form" :hidden="hiddenRegisterForm">
            <div class="form__item">
                <div class="label">Имя пользователя</div>
                <input v-model="registerForm.username" type="string" placeholder="Введите username"
                    class="input__value">
            </div>
            <div class="form__item">
                <div class="label">Пароль</div>
                <input v-model="registerForm.password" type="password" placeholder="Введите пароль"
                    class="input__value">

            </div>
            <div class="form__item">
                <div class="label">Подвердить пароль</div>
                <input v-model="registerForm.confirm_password" type="password" placeholder="Введите пароль еще раз"
                    class="input__value">
            </div>
            <div class="form__item">
                <button class="form__button" :disabled="disabledRegisterSubmit"
                    :class="{ 'cursor-not-allowed': disabledRegisterSubmit }" @click="registerSubmit">
                    Подтвердить
                </button>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">
    .auth__container {
        margin: auto;
        max-width: 600px;
        text-align: center;
    }

    .form__title {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #06044d;
        color: #fff;
        font-weight: 800px;
        font-size: 24px;
        margin: 20px 0;
        border-radius: 5px;
        padding: 5px 0px;
        box-shadow: 0px 9px 24px rgba(0, 0, 0, .4);
    }

    .form {
        background-color: #fff;
        padding: 10px 0px;
        border-radius: 16px;
        box-shadow: 0px 9px 24px rgba(0, 0, 0, .18);
    }

    .form__item {
        max-width: 350px;

        margin: 20px auto;
    }

    .label {
        text-align: left;
        font-size: 18px;
        border-bottom: 2px solid #06044d;
    }

    .input__value {
        background-color: #fff;
        margin: 3px 0;
        border: none;
        outline: none;
        padding: 3px 9px;
        font-size: 18px;
        border-bottom: 1px solid #fff;

        &:focus {
            border-bottom: 1px solid;
        }
    }

    .form__button {
        height: 45px;
        margin-top: 10px;
        border: none;
        border-radius: 8px;
        padding: 3px 20px;
        transition: background-color .7s linear;

        &:hover {
            background-color: #06044d;
            color: #fff;
        }
    }

    @media (max-width: 768px) {
        .auth__container {
            max-width: 300px;
        }

        .form__title {
            margin: 10px 0;
        }

        .form__item {
            margin: 10px auto;
            max-width: 200px;

            .label {
                font-size: 14px;
            }

            .input__value {
                max-width: 200px;
                font-size: 14px;
            }
        }


    }
</style>
