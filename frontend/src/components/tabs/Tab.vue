<template>
    <div v-if="isActive" class="flex flex-col flex-grow">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useTab, type TabData } from './useTabs'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    onRemove: {
        type: Function,
        required: false
    }
})

const tabData: TabData = reactive({ 
    name: props.name,
    onRemove: props.onRemove as (() => void) ?? null
})
const { isActive } = useTab(tabData)
</script>
