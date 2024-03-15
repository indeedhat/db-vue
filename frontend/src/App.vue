<template>
    <toast-container />
    <div class="bg-neutral-100 p-lg dark:bg-neutral-900 flex max-h-screen min-h-screen flex-col">
        <router-view />
    </div>
</template>

<script lang="ts" setup>
import ToastContainer from '@/modules/toast/components/ToastContainer.vue'
</script>

<style scoped>
div {
    box-shadow: inset 0 8px 24px rgba(0, 0, 0, 1)
}
</style>
