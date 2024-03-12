<template>
    <button class="dark:bg-neutral-800 border-neutral-600 border p-4 text-neutral-500">
        <h1 class="text-xl font-bold">{{ details.type }}</h1>
        <h2>{{ details.name }}</h2>
        <span class="text-neutral-600">{{ details.host }}:{{ details.port }}</span>
    </button>
</template>

<script lang="ts" setup>
import { database } from '../../../../wailsjs/go/models'

const props = defineProps<{
    details: database.ConnectionDetails
}>();
</script>

<style scoped>
article {
    width: 300px;
}
</style>
