<script setup lang="ts">
    import { useRoute } from "vue-router";
    import { storeToRefs } from "pinia";
    import { useUserStore } from "../stores/user.store";
    import { ref, onBeforeMount, onBeforeUnmount } from "vue";
    import cookies from "@/services/cookies.service";
    import CryptList from "@/components/CryptList.vue";
    import { useCryptStore } from "@/stores/crypts.store";


    const showUp = ref(true)

    const userStore = useUserStore()
    const userEmail = ref(cookies.get("username"))

    const cryptStore = useCryptStore()

    const crypts = ref([])
    const crypts24hUp = ref([])
    const crypts24hDown = ref([])

    const path = ref(window.location.pathname)

    const isAuth = ref(false)

    async function loadData() {
        const authed = await userStore.fetchUser()

        if (authed) {
            isAuth.value = true
        } else {
            if (path.value != "/login") {
                let ok = await cryptStore.fetchData()
                if (ok) {
                    crypts.value = cryptStore.crypts
                    crypts24hUp.value = cryptStore.crypts.toSorted((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h).slice(0, 10)
                    crypts24hDown.value = cryptStore.crypts.toSorted((a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h).slice(0, 10)
                }
            }
        }

    }

    onBeforeMount(() => {
        loadData();
    })

    function logout() {
        cookies.remove("access")
        cookies.remove("refresh")
        localStorage.clear()
        window.location.reload()
    }
</script>

<template>
    <div class="layout">
        <div class="header">
            <div class="container">
                <div class="header__line">
                    <div class="logo">bit.Balance</div>
                    <div class="dynamic">
                        <div class="account" v-if="isAuth">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="size-7">
                                <path fill-rule="evenodd"
                                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                    clip-rule="evenodd" />
                            </svg>
                            <div class="account__email">{{ userEmail }}</div>
                        </div>
                        <div class="login" v-else>
                            <div class="login__item">
                                <a :href="$router.resolve({ name: 'login', query: { showLoginForm: 1 } }).href"
                                    class="login__label">Войти</a> <br>
                            </div>
                            <div class="login__item">
                                <a :href="$router.resolve({ name: 'login', query: { showRegisterForm: 1 } }).href"
                                    class="login__label">Зарегистрироваться</a>
                            </div>
                        </div>
                    </div>
                    <div class="meta">
                        <button class="logout" v-if="isAuth" @click="logout">Выйти</button>
                        <div class="meta__item" v-else v-for="chapter in ['Контакты', 'Поддержка', 'О нас']"
                            :key="chapter">
                            {{ chapter }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="container">
                <router-view v-if="isAuth || path == '/login'"></router-view>
                <div class="def" v-else>
                    <div class="blocks">
                        <div class="b greeting">Авторизуйтесь, чтобы открыть дверь в будущее инвестирования с
                            персонализированным криптопортфелем</div>
                        <div class="b">
                            <crypt-list class="crypt__block all" :crypts="crypts"></crypt-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .container {
        width: 90vw;
        margin: auto;
    }

    .header {
        display: flex;
        align-items: center;
        top: 0;
        z-index: 10;
        height: 9vh;
        background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgb(9, 9, 121) 35%, rgba(0, 212, 255, 1) 100%);
        color: #fff;
    }

    .logo {
        font-size: 25px;
    }

    .dynamic {
        position: absolute;
        left: 50vw;
        transform: translate(-50%, 0);
        text-align: center;
    }

    .main {
        display: flex;
        align-items: center;
        height: 91vh;
        position: relative;
    }

    .header__line {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .login__item {
        margin-top: .5vh;
    }

    .login__label {
        border-bottom: 1px solid;
    }

    .account {
        display: flex;
        align-items: center;

        &__username {
            font-size: 20px;
        }
    }

    .meta {
        display: flex;
        text-align: center;
    }

    .meta__item {
        margin-left: 2vw;
    }

    .content {
        z-index: 20;
    }

    .greeting {
        text-align: center;
        font-size: 20px;
        font-weight: 800;
    }

    .crypt__block {
        max-height: 55vh;
    }

    .b {
        margin: 13vh 0;
    }

    .btn {
        width: 100%;
        font-size: 20px;
        border: 2px solid;
        padding: 3px;
        border-radius: 7px;
        color: #fff;
    }


    @media (max-width: 768px) {
        .container {
            width: 95vw;
        }

        .header {
            height: 9vh;
        }

        .meta {
            display: flex;
            flex-direction: column;

            &__item {
                font-size: 14px;
            }
        }

        .greeting {
            font-size: 16px;
        }
    }
</style>
