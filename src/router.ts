import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/pages/LoginPage.vue";
import MainPage from "@/pages/MainPage.vue";
import PortfolioPage from "@/pages/PortfolioPage.vue";

const routes = [
    {
        path: "/",
        name: "main",
        component: MainPage,
    },
    {
        path: "/login",
        name: "login",
        component: LoginPage,
        props: true
    },
    {
        path: "/portfolio",
        name: "portfolio",
        component: PortfolioPage,
    }
]

const router = createRouter(
    {
        history: createWebHistory(),
        linkActiveClass: "active",
        linkExactActiveClass: "active",
        routes,
    }
)

export default router;
