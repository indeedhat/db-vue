<template>
    <dialog ref="dialog" 
        class="gap-md border-2 p-5 shadow-xl dark:border-neutral-500 dark:bg-neutral-700"
        @click="handleBackdropClose"
    >
        <slot />
    </dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
    open: boolean
    onBackdropClick?: () => void
}>()

const dialog = ref<HTMLDialogElement|undefined>()

const handleBackdropClose = (e: MouseEvent): void => {
    if (!e.clientX && !e.clientY || !props.onBackdropClick) {
        return
    }

    const rect = dialog.value?.getBoundingClientRect()
    const inDialog = rect?.top! <= e.clientY 
        && rect?.top! + rect?.height! >= e.clientY
        && rect?.left! <= e.clientX 
        && rect?.left! + rect?.width! >= e.clientX 

    if (inDialog) {
        return
    }

    dialog.value?.close()
    props.onBackdropClick?.()
}
const handleToggle = (): void => props.open
    ? dialog.value?.showModal()
    : dialog.value?.close()

onMounted(handleToggle)
watch(
    () => props.open,
    (val, prev) => {
        if (val !== prev) {
            handleToggle()
        }
    }
)
</script>
