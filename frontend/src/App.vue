<template>
    <toast-container />
    <div class="bg-neutral-100 p-lg shadow-[inset_0_8px_24px_rgba(0,0,0,0.1)] dark:bg-neutral-900 flex max-h-screen min-h-screen flex-col ">
        <splash-screen />
    </div>
</template>

<script lang="ts" setup>
//import Index from './modules/db-view/Index.vue'
import SplashScreen from './modules/splash/SplashScreen.vue'
import ToastContainer from './modules/toast/components/ToastContainer.vue'
</script>
