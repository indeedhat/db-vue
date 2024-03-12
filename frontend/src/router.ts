import { createRouter, createWebHistory } from "vue-router"

const routes = [
    { path: "/", component: () => import("./modules/splash/SplashScreen.vue") },
    { path: "/db", component: () => import("./modules/db-view/Index.vue") },
]

const router = createRouter({ 
    history: createWebHistory("/"),
    routes 
})

export default router
