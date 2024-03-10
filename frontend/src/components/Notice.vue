<template>
    <section class="notice mb-4 bg-primary-lightest p-2" :class="noticeClasses">
        <h1 class="text-xl text-bold" v-if="title">{{ title }}</h1>
        <slot />
    </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
    type: {
        type: String,
        default: 'notice'
    },
    title: String
})

const noticeClasses = computed(() => {
    switch (props.type) {
        default:
        case 'notice':
            return {
                [`bg-primary-light dark:bg-primary-dark`]: true
            }
        case 'success':
            return {
                [`bg-success-light`]: true
            }
        case 'error':
            return {
                [`bg-warning-light`]: true
            }
    }
})
</script>
