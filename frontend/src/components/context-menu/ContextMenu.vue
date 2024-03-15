<template>
    <div ref="self"
        v-click-outside="onClose"
        v-if="open"
        :style="{ left: `${coords.x}px`, top: `${coords.y}px` }"
        class="dark:border-neutral-600 border-r dark:bg-neutral-700 min-w-[200px] fixed z-50"
    >
    <ul>
        <slot />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// @ts-ignore
import vClickOutside from 'click-outside-vue3';

const props = defineProps<{
    onClose?: () => void
}>()

const open = ref<boolean>(false)
const coords = ref<{ x: number, y: number }>({ x: 0, y: 0 })

export interface ContextMenuType {
    open: (x: number, y: number) => void
    close: () => void
}

defineExpose({
    open: (x: number, y: number): void => {
        coords.value.x = x
        coords.value.y = y
        open.value = true
    },
    close: (): void => {
        console.log("close context")
        open.value = false
        if (props.onClose) {
            props.onClose()
        }
    }
})
</script>
