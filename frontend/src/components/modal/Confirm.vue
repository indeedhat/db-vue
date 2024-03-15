<template>
    <modal :open="open">
        <section-title>{{ title }}</section-title>
        <div class="my-6 py-2 border-y dark:text-slate-200">
            <slot />
        </div>
        <div class="flex flex-row justify-around gap-2">
            <basic-button @click="accept?.(true)">{{ continueText ?? "Continue" }}</basic-button>
            <basic-button @click="accept?.(false)">{{ cancelText ?? "Cancel" }}</basic-button>
        </div>
    </modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import BasicButton from '@/components/Button.vue'
import SectionTitle from '@/components/Title.vue'

defineProps<{
    title: string
    continueText?: string
    cancelText?: string
}>()

const accept = ref<AcceptFunc|undefined>()
const open = ref<boolean>(false)

type AcceptFunc = (v: boolean) => void
export interface ConfirmType {
    open: (a: AcceptFunc) => void
    close: () => void
}

defineExpose({
    open: (a: AcceptFunc) => {
        open.value = true
        accept.value = a
    },
    close: () => {
        open.value = false
        accept.value = undefined
    }
})
</script>
